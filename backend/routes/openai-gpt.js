// Express routes for the OpenAI GPT-3 API
const express = require('express');
const router = express.Router();
const axios = require('axios');
const config = require('../config.json');
const openaiconfig = require('./openai-config.json');
const { writeData, updateData } = require('../data/data-logging.js')

//OpenAI API key and endpoint for GPT 3.5 completion API
const openaiKey = config[0].openai_key;
const openaiEndpoint = config[0].openai_endpoint;
const openaiDeploymentName = config[0].openai_deployment_name;

//OpenAI API key and endpoint for GPT-4 Chat API
const aoai_chatgpt_4_key = config[0].aoai_chatgpt_4_key;
const aoai_chatgpt_4_endpoint = config[0].aoai_chatgpt_4_endpoint;
const aoai_chatgpt_4_deployment_name = config[0].aoai_chatgpt_4_deployment_name;
const aoai_chatgpt_4_api_version = config[0].aoai_chatgpt_4_api_version;

//OpenAI API key and endpoint for GPT-V API
const aoai_gptv_key = config[0].gptv_key;
const aoai_gptv_endpoint = config[0].gptv_endpoint;

//Set up OpenAI GPT-3 parameters
const openaiMaxTokens = openaiconfig[0].openai_max_tokens;
const openaiTemperature = openaiconfig[0].openai_temperature;
const openaiTopP = openaiconfig[0].openai_top_p;
const openaiFrequencyPenalty = openaiconfig[0].openai_frequency_penalty;
const openaiPresencePenalty = openaiconfig[0].openai_presence_penalty;
const openaiApiVersion = openaiconfig[0].openai_api_version;

router.get('/gpt/sayhello', async (req, res) => {
    const currentDateTime = new Date();    
    res.send('Hello World from the OpenAI GPT backend! ' + currentDateTime)
});

router.post('/gpt/customPrompt', async (req, res) => {
    // Migrate to Chat Completions to support GPT-4o deployments
    const requestText = typeof req.body.transcript === 'string' ? req.body.transcript : JSON.stringify(req.body.transcript);
    const requestCustomPrompt = req.body.customPrompt || '';

    const url = aoai_chatgpt_4_endpoint + 'openai/deployments/' + aoai_chatgpt_4_deployment_name + '/chat/completions?api-version=' + aoai_chatgpt_4_api_version;
    const headers = { 'Content-Type': 'application/json', 'api-key': aoai_chatgpt_4_key };

    const system_content = `You are a helpful analytics assistant. Follow the user's custom instructions carefully and extract or analyze the content from the provided transcript.`;
    const user_content = `TRANSCRIPT:\n${requestText}\n\nINSTRUCTIONS:\n${requestCustomPrompt}`;

    const params = {
        messages: [
            { role: 'system', content: system_content },
            { role: 'user', content: user_content }
        ],
        max_tokens: 1000,
        temperature: openaiTemperature ?? 0.1,
        top_p: openaiTopP ?? 1,
        frequency_penalty: openaiFrequencyPenalty ?? 0,
        presence_penalty: openaiPresencePenalty ?? 0
    };

    try {
        const chatResponse = await axios.post(url, params, { headers });
        // Maintain original response shape (choices[0]) for compatibility
        res.send(chatResponse.data.choices[0]);
        // var endtime = new Date() - starttime; // perf logging optional
        // writeData(req.body.transcript, requestCustomPrompt, chatResponse.data.choices[0], req.ip, 'chatcompletion4-customPrompt');
    } catch (error) {
        if (error.response) {
            console.error('ERROR WITH AZURE OPENAI API:', error.message + ' : ' + (error.response.data?.error?.message || ''));
            return res.status(error.response.status).send(error.response.data);
        }
        console.error('ERROR WITH AZURE OPENAI API:', error.message);
        res.status(500).send({ error: { message: error.message } });
    }
});

//Post operation /openai/gpt/agentassist4
router.post('/gpt/liveguidance', async (req, res) => {
    const conversation_transcript = JSON.stringify(req.body.transcript);
    const requestCustomTemplate = req.body.customTemplate;
    const url = aoai_chatgpt_4_endpoint + 'openai/deployments/' + aoai_chatgpt_4_deployment_name + '/chat/completions?api-version=' + aoai_chatgpt_4_api_version;

    const system_content = `ROLE: You are an AI assistant that goes through a list of questions provided to you and checks which the questions are answered or not answered in the provided transcript of conversation between a call center agent and customer. 
    TASK: You should go through the entire conversation transcript, analyze given list of questions, imply what you need to from the transcript, and guess if those questions have been answered or addressed. Please provide output in two sections: in the first section list the questions that are already answered. In the second section list the questions that are not answered or addressed.  
    QUESTIONS:
    ${requestCustomTemplate}
    USER FORMAT:
    <TRANSCRIPT>
    ...
    <GO>
    ASSISTANT FORMAT:
    Addressed Questions
    <Question Number>. <Question> - <Answer>
    Unaddressed Questions
    <Question Number>. <Question>
    CONSTRAINT: if the answer can be inferred from the transcript, consider the question addressed
    CONSTRAINT: if the customer says anything in relation to the question, consider the question addressed
    CONSTRAINT: answers should use as few words as possible and no longer than 1 sentence.`

    const messages = [
        { role: "system", content: system_content },
        { role: "user", content: "\n<TRANSCRIPT>\n" + conversation_transcript + "<GO>"},
    ];
    var starttime = new Date();
    const headers = {'Content-Type': 'application/json', 'api-key': aoai_chatgpt_4_key};
    const params = {
        messages: messages,
        max_tokens: 4000,
        temperature: 0
    }
    try{
        const chatcompletionResponse = await axios.post(url, params, {headers: headers});
        res.send(chatcompletionResponse.data.choices[0]); 
        var endtime = new Date() - starttime;         
       // writeData(req.body.transcript, requestCustomTemplate, chatcompletionResponse.data.choices[0], req.ip, "chatcompletion4-agentassist4", endtime);
    }catch(error){
        console.error('ERROR WITH AZURE OPENAI API:', error.message);
        res.send(error.message);
        //writeData(req.body.transcript, requestCustomTemplate, error, req.ip, "chatcompletion4-agentassist4");
    }       
});

//Post operation /gptv/imageinsights  
router.post('/gptv/imageinsights', async (req, res) => {  
    const GPTV_KEY = aoai_gptv_key;    
    const GPTV_ENDPOINT = aoai_gptv_endpoint;    
      
    const PROMPT_USER = "<GO>"  ;
    
    const PROMPT_SYSTEM =`You are an AI assistant that helps people find information
    Vehicles in images are US vehicles with driver sitting left facing forward.
    When the user says '<GO>', Identify all the cars in all images, for each photo if it contains a vehicle, list its damages in the following format
    <FORMAT>
    Photo_Insights <number>: 
    PHOTO DESCRIPTION: Provide a short description of the image along with key insights. 
    VEHICLE DESCRIPTION: <GIVE YOUR BEST GUESS OF THE FOLLOWING, USE PROPER NAMES, color, make, model> 
    COLLISION DAMAGE VISIBLE: <only if it's the vehicle in the photo has been in a major collision accident, true or false>
    DAMAGED PARTS: <only if collision damage is visible, damage parts, use driver/passenger side>
    DAMAGED ZONES: <only if collision damage is visible,list of damage zones, select from Passenger side front, Passenger side front fender, Passenger side mid-section, Passenger side rear panel, Passenger side rear, Rear, Front, Roof, Undercarriage, Driver side rear, Driver side rear panel, Driver side mid-section, Driver side front, Driver side front fender    >
    POINT OF IMPACT ZONES: <only if there are damage zones, point of impact, select the most damaged zone from damage part zones>
    AIRBAGS DEPLOYED: <DETECTION OF ANY WHITE BLOB VISIBLE THROUGH THE WINDOWS IN THE PHOTO THAT MIGHT BE AIRBAGS. IF WINDOWS ARE NOT OPAQUE ASSUME YOU CAN SEE THE INTERIOR TO DETERMINE THIS VALUE, true or false>
    </FORMAT>
    if the value of a field is not available do not include it.
    if a photo does not contain a vehicle just give a description and mention that photo does not contain a vehicle.`

    const images = req.body; // Array of image objects  
    var starttime = new Date();
    const imagesToProcess = images.slice(0, 3);  
    console.log("GPTV insights processing request");
    // Fetch all images and encode to base64  
    const encodedImagesPromises = imagesToProcess.map(async imageObj => {  
        const IMAGE_PATH = imageObj.sasUrl;  
  
        // Fetch the image from Azure Storage    
        let responseImage;    
        try {    
            responseImage = await axios.get(IMAGE_PATH, {    
                responseType: 'arraybuffer' // Response type for binary data    
            });    
        } catch (error) {    
            console.error(`Failed to fetch image: ${error}`);    
            res.send(`Failed to fetch image: ${error}`);    
            return;    
        }    
  
        // Encode the image to base64    
        return Buffer.from(responseImage.data, 'binary').toString('base64');  
    });  
  
    // Resolve all promises  
    const encodedImages = await Promise.all(encodedImagesPromises);  
  
    const headers = {  
        "Content-Type": "application/json",  
        "api-key": GPTV_KEY,  
    };  
      
    const payload = {  
        "messages": [  
            {  
                "role": "system",  
                "content": PROMPT_SYSTEM
            },  
            {  
                "role": "user",  
                "content": [  
                    ...encodedImages.map(encodedImage => ({ image: encodedImage })),  
                    PROMPT_USER  
                ]  
            }
        ],  
        "temperature": 0,  
        "top_p": 0.95,  
        "max_tokens": 2500  
    };       
    
    try {  
        const response = await axios.post(GPTV_ENDPOINT, payload, { headers: headers });  
        // Extract the content string  
        const contentStr = response.data.choices[0].message.content;  
  
        // Split the content string into separate insights  
        const insights = contentStr.split('Photo_Insights ').slice(1); // Remove first empty string  
        //console.log("GPTV insight: ", insights)
  
        // Construct the final response array  
        const finalResponse = imagesToProcess.map((imageObj, i) => {  
            return {  
                name: imageObj.name,  
                sasUrl: imageObj.sasUrl,  
                imageInsights: insights[i]  
            };  
        });  
  
        res.send(finalResponse);
        var endtime = new Date() - starttime;
        //console.log("GPTV insights processed in time: ", endtime);
        //writeData("Image names", PROMPT_SYSTEM, finalResponse, req.ip, "gptv-imageinsights", endtime);
    } catch (error) {  
        console.error(`Failed to post data: ${error}`);  
        res.send(`Failed to post data: ${error}`);  
        //writeData(req.body, PROMPT_SYSTEM, error, req.ip, "gptv-imageinsights");
    }  
});  

//Post operation /gpt/recommendation - Generate investment recommendations  
router.post('/gpt/recommendation', async (req, res) => {
    try {
        const conversation_transcript = req.body.transcript;
        
        // Input validation
        if (!conversation_transcript) {
            return res.status(400).send({
                message: { 
                    content: 'Error generating recommendation: No transcript provided' 
                }
            });
        }
        
        if (typeof conversation_transcript !== 'string') {
            return res.status(400).send({
                message: { 
                    content: 'Error generating recommendation: Invalid transcript format' 
                }
            });
        }
        
        if (conversation_transcript.length < 10) {
            return res.status(400).send({
                message: { 
                    content: 'Error generating recommendation: Transcript too short for analysis' 
                }
            });
        }
        
        console.log(`Generating recommendations with FULL transcript (${conversation_transcript.length} characters)`);
        
        // Check if Azure OpenAI configuration is available
        if (!aoai_chatgpt_4_endpoint || !aoai_chatgpt_4_deployment_name || !aoai_chatgpt_4_api_version || !aoai_chatgpt_4_key) {
            console.error('Azure OpenAI configuration missing');
            return res.status(500).send({
                message: { 
                    content: 'Error generating recommendation: Service configuration issue' 
                }
            });
        }
        
        const url = aoai_chatgpt_4_endpoint + 'openai/deployments/' + aoai_chatgpt_4_deployment_name + '/chat/completions?api-version=' + aoai_chatgpt_4_api_version;
    
        const system_content = `Act as a Fisher Investments senior investment advisor who specializes in the comprehensive product and service portfolio offered by Fisher Investments. 

You are analyzing the COMPLETE conversation transcript between a Fisher Investments advisor and a potential client. This transcript contains the ENTIRE conversation history, not just individual utterances. Your task is to analyze ALL the information provided throughout the conversation to recommend suitable Fisher Investments products and services that could enhance the client's financial wellbeing and meet their specific investment needs.

IMPORTANT: Analyze the FULL conversation context including:
- All client statements about financial goals and objectives
- Complete discussion of risk tolerance and investment timeline
- Full employment/income information shared
- Any family or estate planning considerations mentioned
- All investment experience or preferences discussed
- Complete financial situation context

Fisher Investments Product Line Focus Areas:
- Portfolio Management Services (equity-focused, diversified global portfolios)
- Retirement Planning & IRA Management
- Tax-Efficient Investment Strategies
- Estate Planning Integration
- International & Emerging Markets Exposure
- Risk Management & Asset Allocation
- Wealth Transfer Planning
- Private Client Services (for high-net-worth individuals)

Key Investment Philosophy:
- Long-term growth focus with disciplined approach
- Global diversification across developed and emerging markets
- Research-driven investment decisions
- Active portfolio management
- Focus on equity investments as primary wealth-building vehicle

IMPORTANT CONSTRAINTS:
- If the COMPLETE transcript does not contain sufficient information about the client's financial situation, investment goals, risk tolerance, or time horizon, respond ONLY with: "***Waiting for More Client Information***"
- Only generate recommendations when you have adequate information about: employment/income status, investment objectives, time horizon, risk tolerance, current financial situation
- Focus exclusively on Fisher Investments' actual service offerings
- Provide realistic, client-appropriate recommendations based on the COMPLETE conversation context

If sufficient information is available, provide 4 concise bullet points recommending specific Fisher Investments services with brief explanations of why each would benefit this particular client based on their disclosed circumstances throughout the entire conversation.`;

        const messages = [
            { role: "system", content: system_content },
            { role: "user", content: `Here's the COMPLETE conversation transcript between the Fisher Investments advisor and client. Please analyze the ENTIRE conversation context to provide comprehensive investment recommendations:\n\n${conversation_transcript}\n\nBased on ALL the information discussed throughout this complete conversation, provide investment recommendations from Fisher Investments' service portfolio.`},
        ];
        
        var starttime = new Date();
        const headers = {'Content-Type': 'application/json', 'api-key': aoai_chatgpt_4_key};
        const params = {
            messages: messages,
            max_tokens: 1500,
            temperature: 0.3
        }
        
        const chatcompletionResponse = await axios.post(url, params, {headers: headers});
        res.send(chatcompletionResponse.data.choices[0]); 
        var endtime = new Date() - starttime;         
        // writeData(req.body.transcript, "investment-recommendation", chatcompletionResponse.data.choices[0], req.ip, "recommendation-generation", endtime);
    }catch(error){
        console.error('ERROR WITH RECOMMENDATION GENERATION:', error);
        
        // Enhanced error handling with status codes
        if (error.response) {
            const statusCode = error.response.status;
            let errorMessage = 'Error generating recommendation: ';
            
            switch (statusCode) {
                case 400:
                    errorMessage += 'Invalid request format or parameters';
                    break;
                case 401:
                    errorMessage += 'Authentication failed';
                    break;
                case 403:
                    errorMessage += 'Access denied';
                    break;
                case 429:
                    errorMessage += 'Service temporarily busy, please try again';
                    break;
                case 500:
                    errorMessage += 'Service temporarily unavailable';
                    break;
                default:
                    errorMessage += `Service error (${statusCode})`;
            }
            
            console.error(`API Error - Status: ${statusCode}, Data:`, error.response.data);
            res.status(statusCode).send({
                message: { 
                    content: errorMessage,
                    error_type: 'api_error',
                    status_code: statusCode
                }
            });
        } else if (error.request) {
            console.error('Network Error:', error.request);
            res.status(503).send({
                message: { 
                    content: 'Error generating recommendation: Network connection issue',
                    error_type: 'network_error'
                }
            });
        } else {
            console.error('Configuration Error:', error.message);
            res.status(500).send({
                message: { 
                    content: 'Error generating recommendation: Service configuration issue',
                    error_type: 'config_error'
                }
            });
        }
        
        // writeData(req.body.transcript, "investment-recommendation", error, req.ip, "recommendation-generation");
    }       
});

//Post operation /gpt/marketinsights - Generate market analysis and insights  
router.post('/gpt/marketinsights', async (req, res) => {
    try {
        const conversation_transcript = req.body.transcript;
        
        // Input validation
        if (!conversation_transcript) {
            return res.status(400).send({
                message: { 
                    content: 'Error generating market insights: No transcript provided' 
                }
            });
        }
        
        if (typeof conversation_transcript !== 'string') {
            return res.status(400).send({
                message: { 
                    content: 'Error generating market insights: Invalid transcript format' 
                }
            });
        }
        
        if (conversation_transcript.length < 10) {
            return res.status(400).send({
                message: { 
                    content: 'Error generating market insights: Transcript too short for analysis' 
                }
            });
        }
        
        console.log(`Generating market insights with FULL transcript (${conversation_transcript.length} characters)`);
        
        // Check if Azure OpenAI configuration is available
        if (!aoai_chatgpt_4_endpoint || !aoai_chatgpt_4_deployment_name || !aoai_chatgpt_4_api_version || !aoai_chatgpt_4_key) {
            console.error('Azure OpenAI configuration missing');
            return res.status(500).send({
                message: { 
                    content: 'Error generating market insights: Service configuration issue' 
                }
            });
        }
        
        const url = aoai_chatgpt_4_endpoint + 'openai/deployments/' + aoai_chatgpt_4_deployment_name + '/chat/completions?api-version=' + aoai_chatgpt_4_api_version;
    
        const system_content = `Act as a Fisher Investments senior market research analyst who specializes in providing market insights and analysis based on client conversation patterns.

You are analyzing a COMPLETE conversation transcript between a Fisher Investments advisor and a client. Your task is to generate market insights that would be relevant to this specific client discussion and their investment profile based on what was discussed.

IMPORTANT: Analyze the FULL conversation to understand:
- Client's investment preferences and risk tolerance
- Timeline and investment horizon mentioned
- Asset classes or sectors of interest
- Economic concerns or market views expressed
- Investment experience level
- Geographic preferences (domestic vs international)

Generate market insights that would be particularly relevant to this client's profile. Focus on:
- Current market trends that align with their investment preferences
- Economic indicators relevant to their timeline and risk tolerance
- Sector analysis for areas they showed interest in
- Market opportunities that match their profile
- Risk factors they should be aware of based on their situation

IMPORTANT CONSTRAINTS:
- If the transcript lacks sufficient information about the client's investment preferences or profile, respond with: "***Insufficient Client Context for Market Analysis***"
- Generate insights that are specifically relevant to the client profile discussed
- Focus on actionable market intelligence that would help this particular client
- Keep insights professional and based on realistic market analysis

Provide 4-6 concise bullet points with current market insights that would be most relevant to this specific client based on their conversation context.`;

        const messages = [
            { role: "system", content: system_content },
            { role: "user", content: `Here's the COMPLETE conversation transcript between the Fisher Investments advisor and client. Please analyze the conversation to understand the client's investment profile and generate relevant market insights:\n\n${conversation_transcript}\n\nBased on the client profile and preferences discussed in this conversation, provide market insights that would be most relevant to them.`},
        ];
        
        var starttime = new Date();
        const headers = {'Content-Type': 'application/json', 'api-key': aoai_chatgpt_4_key};
        
        console.log("Calling Azure OpenAI for market insights...");
        
        const data = {
            messages: messages,
            max_tokens: 800,
            temperature: 0.1,
            top_p: 0.9,
            frequency_penalty: 0,
            presence_penalty: 0
        };
        
        const response = await axios.post(url, data, { headers });
        
        var endtime = new Date();
        var elapsedtime = endtime - starttime;
        
        console.log("Azure OpenAI Response Status:", response.status);
        console.log("Market insights generated successfully in", elapsedtime, "ms");
        
        if (response.data && response.data.choices && response.data.choices[0] && response.data.choices[0].message) {
            const marketInsights = response.data.choices[0].message.content;
            console.log("Generated market insights:", marketInsights.substring(0, 200) + "...");
            
            res.send({
                message: { 
                    content: marketInsights,
                    timestamp: new Date().toISOString(),
                    processing_time_ms: elapsedtime
                }
            });
            
            // writeData(req.body.transcript, "market-insights", response.data, req.ip, "market-analysis");
        } else {
            console.error("Unexpected response format from Azure OpenAI");
            res.status(500).send({
                message: { 
                    content: 'Error generating market insights: Unexpected response format'
                }
            });
        }
        
    } catch (error) {
        console.error('Error generating market insights:', error.message);
        
        if (error.response) {
            console.error('Azure OpenAI API Error:', error.response.status, error.response.data);
            res.status(error.response.status).send({
                message: { 
                    content: `Error generating market insights: ${error.response.data?.error?.message || 'API Error'}`,
                    error_type: 'api_error'
                }
            });
        } else if (error.request) {
            console.error('Network Error:', error.request);
            res.status(500).send({
                message: { 
                    content: 'Error generating market insights: Network connection issue',
                    error_type: 'network_error'
                }
            });
        } else {
            console.error('Configuration Error:', error.message);
            res.status(500).send({
                message: { 
                    content: 'Error generating market insights: Service configuration issue',
                    error_type: 'config_error'
                }
            });
        }
        
        // writeData(req.body.transcript, "market-insights", error, req.ip, "market-analysis");
    }       
});

// Post operation /gpt/pitch - Generate a detailed client pitch from transcript and recommendation
router.post('/gpt/pitch', async (req, res) => {
    try {
        const conversation_transcript = req.body.transcript;
        const recommendation_text = req.body.recommendation;
        const sentimentData = req.body.sentimentData || null;

        if (!conversation_transcript || !recommendation_text) {
            return res.status(400).send({
                message: {
                    content: 'Error generating pitch: Missing transcript or recommendation'
                }
            });
        }

        if (!aoai_chatgpt_4_endpoint || !aoai_chatgpt_4_deployment_name || !aoai_chatgpt_4_api_version || !aoai_chatgpt_4_key) {
            console.error('Azure OpenAI configuration missing');
            return res.status(500).send({
                message: {
                    content: 'Error generating pitch: Service configuration issue'
                }
            });
        }

        const url = `${aoai_chatgpt_4_endpoint}openai/deployments/${aoai_chatgpt_4_deployment_name}/chat/completions?api-version=${aoai_chatgpt_4_api_version}`;
        const headers = { 'Content-Type': 'application/json', 'api-key': aoai_chatgpt_4_key };

        const system_content = `You are a senior Fisher Investments advisor crafting a professional, client-ready investment pitch document. 
Format your output as clean Markdown, concise but comprehensive, with clear sections and bullet points. 
Derive client details (name, email, phone, location) from the transcript when present; if missing, use 'On file' or omit the field. 
Incorporate the provided AI-generated recommendation faithfully, refining for clarity and polish but preserving substance. 
Return ONLY the Markdown document, no extra commentary.`;

        const user_content = `TRANSCRIPT (full conversation):\n${conversation_transcript}\n\nRECOMMENDATION (AI-generated):\n${recommendation_text}\n\n${sentimentData ? `SENTIMENT DATA (optional):\n${JSON.stringify(sentimentData)}` : ''}\n\nTASK: Produce a detailed client pitch with the following sections:
1) Title: '# Investment Recommendation Presentation'
2) Executive Summary with key insights from the conversation (financial goals, risk profile, horizon, capacity, sentiment)
3) Personalized Recommendations (integrate and polish the provided recommendation)
4) Why These Recommendations? (aligned with goals, risk appropriate, diversification, tax-efficient)
5) Next Steps (immediate actions and ongoing partnership)
6) Investment Process & Timeline (Week 1-2, Week 3-4, Month 2, Quarterly)
7) Compliance & Disclosures
8) Contact Information (Client name and location, Email, Phone, Next Meeting, Portfolio Platform)

Ensure the tone is professional and specific to the client based on the transcript. Output must be valid Markdown.`;

        const params = {
            messages: [
                { role: 'system', content: system_content },
                { role: 'user', content: user_content }
            ],
            max_tokens: 1500,
            temperature: 0.3,
            top_p: 0.9,
            frequency_penalty: 0,
            presence_penalty: 0
        };

        const response = await axios.post(url, params, { headers });
        const content = response?.data?.choices?.[0]?.message?.content;

        if (!content) {
            return res.status(502).send({
                message: { content: 'Error generating pitch: Unexpected response format' }
            });
        }

        return res.send({ message: { content } });
    } catch (error) {
        console.error('Error generating client pitch:', error.message || error);
        if (error.response) {
            return res.status(error.response.status).send({
                message: {
                    content: `Error generating pitch: ${error.response.data?.error?.message || 'API Error'}`,
                    error_type: 'api_error'
                }
            });
        } else if (error.request) {
            return res.status(503).send({
                message: {
                    content: 'Error generating pitch: Network connection issue',
                    error_type: 'network_error'
                }
            });
        } else {
            return res.status(500).send({
                message: {
                    content: 'Error generating pitch: Service configuration issue',
                    error_type: 'config_error'
                }
            });
        }
    }
});

module.exports = router;

