import json
import boto3
import numpy as np

dynamodb = boto3.resource('dynamodb')

def lambda_handler(event, context):
    if event['httpMethod'] == 'POST':
        data = json.loads(event['body'])
        
        print(data)
        
        TABLE_NAME = 'Rekognition'
        
        url_links = []
        results = []
        
        tags = data['tags']
        tags = [x.upper() for x in tags]
        print(tags)
    
        table = dynamodb.Table(TABLE_NAME)
        url_links = []
        
        db_contents = table.scan()
        # print(db_contents)
    
        for x in db_contents['Items']:
            temp = x['Labels']
            temp = temp.split(',')
            temp = [x.upper() for x in temp]
            print(temp)
            contained = np.in1d(temp, tags)
            print(contained)
            print('-------------------------')
            if True in contained:
                results.append(x)
            else:
                print('')
        print(results)
        
        for item in results:
            # replace s3-url to the URL of s3 object
            s3_http = item['s3-url'].replace("s3://reko-storage",
                                          "https://reko-storage.s3.ap-southeast-2.amazonaws.com")
            url_links.append(s3_http)
    
        print(url_links)
    
        return {
            'statusCode': 200,
            'body': json.dumps(url_links),
            'headers': {'Access-Control-Allow-Origin': '*'}
        }