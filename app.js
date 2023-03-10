const express = require('express');
var cors = require('cors');
const AWS = require('aws-sdk');
const config = require('./config.js');
require('dotenv').config();

const app = express()
const port = 3100

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get("/transactions", (req, res, next) => {
    AWS.config.update(config.aws_remote_config);
    const docClient = new AWS.DynamoDB.DocumentClient();

    const params = {
        TableName: config.aws_transactions_table_name
    };

    docClient.scan(params, function (err, data) {

        if (err) {
            console.log(err)
            res.send({
                success: false,
                message: err
            });
        } else {
            const { Items } = data;
            res.send({
                success: true,
                transactions: Items
            });
        }
    });
});

app.post('/transactions', (req, res) => {
    AWS.config.update(config.aws_remote_config);
    const docClient = new AWS.DynamoDB.DocumentClient();
    const transactions = { ...req.body };
    let successes = 0;
    
    transactions.transactions.forEach((t) => {
        var params = {
            TableName: config.aws_transactions_table_name,
            Item: t
        };
    
        // Call DynamoDB to add the item to the table
        docClient.put(params, function (err, data) {
            if (err) {
                res.header("Access-Control-Allow-Origin", "*");
                res.send({
                    success: false,
                    message: err
                });
            } else {
                successes = successes + 1;
                if (successes === transactions.transactions.length) {
                    res.header("Access-Control-Allow-Origin", "*");
                    res.send({
                        success: true,
                        message: "Added transactions"
                    });
                }
            }
        });    
    });
});

app.delete('/transactions', (req, res) => {
    AWS.config.update(config.aws_remote_config);
    const docClient = new AWS.DynamoDB.DocumentClient();
    const transactionId = { ...req.body };    

    var params = {
        TableName: config.aws_transactions_table_name,
        Key: transactionId
    };

    // Call DynamoDB to add the item to the table
    docClient.delete(params, function (err, data) {
        if (err) {
            res.send({
                success: false,
                message: err
            });
        } else {
            res.send({
                success: true,
                message: `Deleted transaction ${transactionId.transaction}`
            });
        }

    })

});

app.get("/net-worth", (req, res, next) => {
    AWS.config.update(config.aws_remote_config);
    const docClient = new AWS.DynamoDB.DocumentClient();

    const params = {
        TableName: config.aws_net_worth_table_name
    };

    docClient.scan(params, function (err, data) {

        if (err) {
            console.log(err)
            res.send({
                success: false,
                message: err
            });
        } else {
            const { Items } = data;
            res.send({
                success: true,
                items: Items
            });
        }
    });
});

app.post('/net-worth', (req, res) => {
    AWS.config.update(config.aws_remote_config);
    const docClient = new AWS.DynamoDB.DocumentClient();
    const items = { ...req.body };
    let successes = 0;
    
    items.items.forEach((t) => {
        var params = {
            TableName: config.aws_net_worth_table_name,
            Item: t
        };
    
        // Call DynamoDB to add the item to the table
        docClient.put(params, function (err, data) {
            if (err) {
                res.header("Access-Control-Allow-Origin", "*");
                res.send({
                    success: false,
                    message: err
                });
            } else {
                successes = successes + 1;
                if (successes === items.items.length) {
                    res.header("Access-Control-Allow-Origin", "*");
                    res.send({
                        success: true,
                        message: "Added net worth items"
                    });
                }
            }
        });    
    });
});

app.delete('/net-worth', (req, res) => {
    AWS.config.update(config.aws_remote_config);
    const docClient = new AWS.DynamoDB.DocumentClient();
    const itemId = { ...req.body };    

    var params = {
        TableName: config.aws_net_worth_table_name,
        Key: itemId
    };

    // Call DynamoDB to add the item to the table
    docClient.delete(params, function (err, data) {
        if (err) {
            res.send({
                success: false,
                message: err
            });
        } else {
            res.send({
                success: true,
                message: `Deleted net worth item ${itemId.itemId}`
            });
        }

    })

});

app.listen(port, () => {
    console.log(`Finance manager backend listening on port ${port}`)
})