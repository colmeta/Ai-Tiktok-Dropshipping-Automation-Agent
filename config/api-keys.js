// Centralized API key management
const config = {
    // Image Generation APIs
    STABILITY_AI_API_KEY: process.env.STABILITY_AI_API_KEY,
    REPLICATE_API_TOKEN: process.env.REPLICATE_API_TOKEN,
    LEONARDO_AI_API_KEY: process.env.LEONARDO_AI_API_KEY,
    DEZGO_API_KEY: process.env.DEZGO_API_KEY,
    
    // Video Generation APIs  
    RUNWAY_ML_API_TOKEN: process.env.RUNWAY_ML_API_TOKEN,
    PIKA_LABS_API_KEY: process.env.PIKA_LABS_API_KEY,
    HUGGINGFACE_API_TOKEN: process.env.HUGGINGFACE_API_TOKEN,
    LUMA_AI_API_KEY: process.env.LUMA_AI_API_KEY,
    
    // Your existing APIs
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    PRINTFUL_API_KEY: process.env.PRINTFUL_API_KEY,
    PRINTIFY_API_KEY: process.env.PRINTIFY_API_KEY,
};

export default config;
