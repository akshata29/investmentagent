// Express routes for Azure AI Language API
//
const express = require('express');
const router = express.Router();
const axios = require('axios');
const config = require('../config.json');

// get config
const textAnalyticsKey = config[0].text_analytics_key;
const textAnalyticsEndpoint = config[0].text_analytics_endpoint;    

//"use strict";
const { TextAnalyticsClient, AzureKeyCredential } = require("@azure/ai-text-analytics");
const { json } = require('express');

router.get('/ta/sayhello', async (req, res) => {
    const currentDateTime = new Date();
    res.send('Hello World from the Azure Language TA backend! ' + currentDateTime)
});

router.post('/ta-key-phrases', async (req, res) => { 
    const requestJSON = JSON.stringify(req.body);
    //console.log('JSON string request body ' + requestJSON);

    const requestText = req.body.transcript; // Don't stringify - keep as plain text
    console.log('Received transcription text type:', typeof requestText);
    console.log('Received transcription text:', requestText);

    try {
        // Ensure requestText is a string and not empty
        if (!requestText || typeof requestText !== 'string') {
            console.log('Invalid requestText:', requestText);
            return res.status(400).send('Invalid transcript text');
        }

        const keyPhrasesInput = [
            requestText,
        ];
        const textAnalyticsClient = new TextAnalyticsClient(textAnalyticsEndpoint,  new AzureKeyCredential(textAnalyticsKey));

        let keyPhrasesText = "Key Phrases: ";
        const keyPhraseResult =  await textAnalyticsClient.extractKeyPhrases(keyPhrasesInput);             
        keyPhraseResult.forEach(document => {            
            keyPhraseResponse = document.keyPhrases;    
            keyPhrasesText += document.keyPhrases;                   
        });   

        //let entityText = "ENTITIES: ";
        let entityText = "";
        const entityResults = await textAnalyticsClient.recognizeEntities(keyPhrasesInput);        
        entityResults.forEach(document => {
            //console.log(`Document ID: ${document.id}`);
            document.entities.forEach(entity => {
                if(entity.confidenceScore > 0.7){
                    //console.log(`\tName: ${entity.text} \tCategory: ${entity.category} \tSubcategory: ${entity.subCategory ? entity.subCategory : "N/A"}`);
                    const currentEntity = "\n" + entity.category + ": " + entity.text;
                    entityText += currentEntity;
                    //console.log(`\tScore: ${entity.confidenceScore}`);                    
                }
            });
        });          

        let piiText = "PII:";
        const piiResults = await textAnalyticsClient.recognizePiiEntities(keyPhrasesInput, "en");
        for (const result of piiResults) {
            if (result.error === undefined) {
                if(result.redactedText.indexOf('*') > -1){
                    //console.log("Redacted Text: ", result.redactedText);
                    piiText += result.redactedText;
                    //console.log(" -- Recognized PII entities for input", result.id, "--");
                }

                for (const entity of result.entities) {
                    //console.log(entity.text, ":", entity.category, "(Score:", entity.confidenceScore, ")");
                    const currentEntity = entity.category + ": " + entity.text;
                    //piiText += currentEntity;
                }
            } else {
                console.error("Encountered an error:", result.error);
            }
        }

        // Add sentiment analysis following Microsoft documentation pattern
        let sentimentData = {
            overall: { sentiment: "neutral", score: 0.5, confidenceScores: { positive: 0, negative: 0, neutral: 1 } },
            sentences: []
        };
        
        try {
            // Ensure we have clean text input - following Microsoft docs
            if (requestText && typeof requestText === 'string' && requestText.trim().length > 0) {
                console.log('Processing sentiment for text:', requestText.substring(0, 100)); // Debug log
                
                // Following the official Azure documentation pattern
                const documents = [requestText.trim()];
                
                // Use proper language parameter as shown in Microsoft docs
                const sentimentResults = await textAnalyticsClient.analyzeSentiment(documents, "en", { 
                    includeOpinionMining: true 
                });
                
                for (const result of sentimentResults) {
                    if (result.error === undefined) {
                        console.log('Sentiment result:', result.sentiment, result.confidenceScores);
                        
                        // Overall document sentiment
                        sentimentData.overall = {
                            sentiment: result.sentiment,
                            score: Math.max(result.confidenceScores.positive, result.confidenceScores.negative, result.confidenceScores.neutral),
                            confidenceScores: result.confidenceScores
                        };

                        // Sentence-level sentiment
                        sentimentData.sentences = [];
                        for (const sentence of result.sentences) {
                            sentimentData.sentences.push({
                                text: sentence.text,
                                sentiment: sentence.sentiment,
                                confidenceScores: sentence.confidenceScores,
                                opinions: sentence.opinions || []
                            });
                        }
                    } else {
                        console.error("Sentiment analysis error:", result.error);
                    }
                }
            } else {
                console.log('Invalid or empty text for sentiment analysis');
            }
        } catch (sentimentError) {
            console.error("Sentiment analysis failed:", sentimentError);
            // Keep default sentiment data if analysis fails
        }

        const headers = { 'Content-Type': 'application/json' };  
        res.headers = headers;                  
        //res.send({ keyPhrasesExtracted: keyPhraseResponse, entityExtracted: entityResults, piiExtracted: piiResults });
        res.send({ 
            keyPhrasesExtracted: keyPhrasesText, 
            entityExtracted: entityText, 
            piiExtracted: piiText,
            sentimentAnalysis: sentimentData
        });
    } catch (err) {
        console.log(err);
        res.status(401).send('There was an error authorizing your text analytics key. Check your text analytics service key or endpoint to the .env file.');
    }        
});

module.exports = router;