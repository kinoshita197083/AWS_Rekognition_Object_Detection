import json
import boto3
import base64
import uuid

s3 = boto3.client('s3')
bucketName = 'reko-storage'
rekognition = boto3.client('rekognition')
dynamodb = boto3.resource('dynamodb')
TABLE_NAME = 'Rekognition'


def lambda_handler(event, context):

    if event['httpMethod'] == 'POST':
        data = json.loads(event['body'])
        name = data['name']
        name="Images/" + name
        
        imageb64 = data['file']
        image = base64.b64decode(imageb64)
            
         #Image URI
        s3URL="s3://{0}/{1}".format(bucketName, name)
        
        #Dynamodb
        table = dynamodb.Table(TABLE_NAME)
        
        #For return
        response = None
        tags = []
        
        #Retrieve DB records
        db_contents = table.scan()
        retrieved_items = db_contents['Items']
        
        result = checkIfImgExists(retrieved_items, s3URL)
        existed = result[0]
        data = result[1]
        
        if existed:
            response = data
            
        else:
            #Store a backup in S3
            s3.put_object(
                Bucket=bucketName,
                Key=name,
                Body=image
                )
            
            #Image Analysis
            response = rekognition.detect_labels(Image={'S3Object' : {'Bucket': bucketName, 'Name': name}}, MinConfidence = 80)
                
            #Generate an uniqueID as a db primary key
            pk = str(uuid.uuid4())
            labels = response['Labels']
            print(labels)
            
            for label in labels:
                tag = label['Name'] 
                print(tag)
                tags.append(tag)
            
            print(tags)
            
            storeResults = table.put_item(
                Item={
                    'RekoId':pk,
                    's3-url':s3URL,
                    'Labels': ','.join(tags)
                }
            )
            
        return {
            'statusCode': 200,
            'body' : json.dumps(response),
            'headers': {'Access-Control-Allow-Origin': '*'}
        }
    

# data refers to db_contents['Items']
def checkIfImgExists(data, s3URL):
    flag = False
    target = None
    for x in data:
        if x['s3-url'] == s3URL:
            print('Item already exists')
            flag = True
            target = x
    #Data restructuring
    if target:
        tags = target['Labels'].split(',')
        label = []
        for y in tags:
            temp = {'Name': y}
            label.append(temp)
        target = {'Labels': label}
        
    return flag, target
