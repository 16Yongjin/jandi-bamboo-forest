const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const path = require('path');

const port = process.env.PORT || 3000;

const app = express();
app.use(bodyParser.json());

var count = 1;

app.use('/', express.static(path.join(__dirname, 'public')));


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'public/talk.html'));
})

app.post('/', (req, res) => {
    const url = 'https://wh.jandi.com/connect-api/webhook/13626446/1ed90c9a9317f164dee5319d92b2d69e';
    const headers = {
        'Accept': 'application/vnd.tosslab.jandi-v2+json',
        'Content-Type': 'application/json'
    };

    const body = {
        "body": "Add:ICT 대나무숲",
        "connectColor": "#FAC11B",
        "connectInfo": [{
            "title": `#애딕트숲_${count}번째 제보`,
            "description" : req.body.chat
        }]
    };
    
    const options = {
        url,
        method: 'POST',
        headers,
        body,
        json: true
    };


    request(options, (error, response, body) => {
        if (!error && response.statusCode == 200) {
            count++;
            return res.status(200).send('ok!');
        }

        return res.status(400).send('잔디에 보내기 실패!');
    })

});

app.get('/getCount', (req, res) => {
    res.send({
        count,
        message: 'current count: ' + count
    })
});

app.post('/setCount', (req, res) => {
    count = req.body.count;
    res.send({
        message: 'current count: ' + count
    });
})

app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});
