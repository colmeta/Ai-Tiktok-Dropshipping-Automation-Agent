// Free API Rotation Content Generator
// Cycles through free tiers automatically when limits are hit

import fetch from 'node-fetch';
import fs from 'fs/promises';
import path from 'path';

class FreeContentGenerator {
    constructor() {
        this.usageTracking = {
            // Image Generation Services
            images: {
                current: 0,
                services: [
                    {
                        name: 'stability_ai',
                        used: 0,
                        limit: 25, // 25 free images per month
                        resetDate: this.getNextMonthStart(),
                        active: true
                    },
                    {
                        name: 'replicate',
                        used: 0,
                        limit: 50, // $10 free credit ≈ 50 generations
                        resetDate: this.getNextMonthStart(),
                        active: true
                    },
                    {
                        name: 'leonardo_ai',
                        used: 0,
                        limit: 150, // 150 free tokens daily
                        resetDate: this.getNextDayStart(),
                        active: true
                    },
                    {
                        name: 'dezgo',
                        used: 0,
                        limit: 100, // 100 free per day
                        resetDate: this.getNextDayStart(),
                        active: true
                    },
                    {
                        name: 'pollinations',
                        used: 0,
                        limit: 1000, // Practically unlimited but rate limited
                        resetDate: this.getNextDayStart(),
                        active: true
                    }
                ]
            },
            // Video Generation Services
            videos: {
                current: 0,
                services: [
                    {
                        name: 'runway_ml',
                        used: 0,
                        limit: 125, // 125 credits free ≈ 5-10 videos
                        resetDate: this.getNextMonthStart(),
                        active: true
                    },
                    {
                        name: 'pika_labs',
                        used: 0,
                        limit: 30, // 30 free videos per month
                        resetDate: this.getNextMonthStart(),
                        active: true
                    },
                    {
                        name: 'huggingface_video',
                        used: 0,
                        limit: 200, // API rate limits
                        resetDate: this.getNextDayStart(),
                        active: true
                    },
                    {
                        name: 'luma_ai',
                        used: 0,
                        limit: 30, // 30 free generations per month
                        resetDate: this.getNextMonthStart(),
                        active: true
                    },
                    {
                        name: 'veo_google',
                        used: 0,
                        limit: 50, // When available in free tier
                        resetDate: this.getNextMonthStart(),
                        active: false // Will activate when available
                    }
                ]
            }
        };
        
        this.loadUsageData();
    }

    getNextMonthStart() {
        const now = new Date();
        return new Date(now.getFullYear(), now.getMonth() + 1, 1);
    }

    getNextDayStart() {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        return tomorrow;
    }

    async loadUsageData() {
        try {
            const data = await fs.readFile('usage_tracking.json', 'utf8');
            const saved = JSON.parse(data);
            this.usageTracking = { ...this.usageTracking, ...saved };
        } catch (error) {
            console.log('📊 Creating new usage tracking file...');
            await this.saveUsageData();
        }
    }

    async saveUsageData() {
        await fs.writeFile('usage_tracking.json', JSON.stringify(this.usageTracking, null, 2));
    }

    resetExpiredLimits() {
        const now = new Date();
        
        ['images', 'videos'].forEach(type => {
            this.usageTracking[type].services.forEach(service => {
                if (now >= service.resetDate) {
                    service.used = 0;
                    service.active = true;
                    service.resetDate = service.name.includes('daily') ? 
                        this.getNextDayStart() : this.getNextMonthStart();
                }
            });
        });
    }

    getNextAvailableService(type) {
        this.resetExpiredLimits();
        
        const services = this.usageTracking[type].services;
        
        // Find first available service with remaining quota
        for (let service of services) {
            if (service.active && service.used < service.limit) {
                return service;
            }
        }
        
        // If all exhausted, return the one with earliest reset
        return services.reduce((earliest, current) => {
            return current.resetDate < earliest.resetDate ? current : earliest;
        });
    }

    // IMAGE GENERATION METHODS
    async generateImageStabilityAI(prompt) {
        try {
            const response = await fetch('https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.STABILITY_AI_API_KEY}`,
                },
                body: JSON.stringify({
                    text_prompts: [{ text: prompt }],
                    cfg_scale: 7,
                    height: 1024,
                    width: 1024,
                    samples: 1,
                    steps: 30,
                })
            });

            if (!response.ok) throw new Error(`Stability AI error: ${response.status}`);
            
            const data = await response.json();
            return {
                success: true,
                imageUrl: `data:image/png;base64,${data.artifacts[0].base64}`,
                service: 'stability_ai'
            };
        } catch (error) {
            return { success: false, error: error.message, service: 'stability_ai' };
        }
    }

    async generateImageReplicate(prompt) {
        try {
            const response = await fetch('https://api.replicate.com/v1/predictions', {
                method: 'POST',
                headers: {
                    'Authorization': `Token ${process.env.REPLICATE_API_TOKEN}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    version: "39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
                    input: { prompt: prompt }
                })
            });

            const prediction = await response.json();
            
            // Poll for completion
            let result = prediction;
            while (result.status !== 'succeeded' && result.status !== 'failed') {
                await new Promise(resolve => setTimeout(resolve, 1000));
                const pollResponse = await fetch(`https://api.replicate.com/v1/predictions/${result.id}`, {
                    headers: { 'Authorization': `Token ${process.env.REPLICATE_API_TOKEN}` }
                });
                result = await pollResponse.json();
            }

            if (result.status === 'succeeded') {
                return {
                    success: true,
                    imageUrl: result.output[0],
                    service: 'replicate'
                };
            } else {
                throw new Error('Generation failed');
            }
        } catch (error) {
            return { success: false, error: error.message, service: 'replicate' };
        }
    }

    async generateImageLeonardoAI(prompt) {
        try {
            const response = await fetch('https://cloud.leonardo.ai/api/rest/v1/generations', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${process.env.LEONARDO_AI_API_KEY}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prompt: prompt,
                    modelId: "6bef9f1b-29cb-40c7-b9df-32b51c1f67d3", // Leonardo Creative
                    width: 1024,
                    height: 1024,
                    num_images: 1,
                })
            });

            const data = await response.json();
            const generationId = data.sdGenerationJob.generationId;

            // Poll for completion
            let completed = false;
            let attempts = 0;
            while (!completed && attempts < 30) {
                await new Promise(resolve => setTimeout(resolve, 2000));
                const statusResponse = await fetch(`https://cloud.leonardo.ai/api/rest/v1/generations/${generationId}`, {
                    headers: { 'Authorization': `Bearer ${process.env.LEONARDO_AI_API_KEY}` }
                });
                const statusData = await statusResponse.json();
                
                if (statusData.generations_by_pk.status === 'COMPLETE') {
                    return {
                        success: true,
                        imageUrl: statusData.generations_by_pk.generated_images[0].url,
                        service: 'leonardo_ai'
                    };
                }
                attempts++;
            }

            throw new Error('Generation timeout');
        } catch (error) {
            return { success: false, error: error.message, service: 'leonardo_ai' };
        }
    }

    async generateImageDezgo(prompt) {
        try {
            const formData = new URLSearchParams();
            formData.append('prompt', prompt);
            formData.append('model', 'epic_realism');
            formData.append('width', '1024');
            formData.append('height', '1024');
            formData.append('guidance', '7.5');
            formData.append('steps', '30');

            const response = await fetch('https://api.dezgo.com/text2image', {
                method: 'POST',
                headers: {
                    'X-Dezgo-Key': process.env.DEZGO_API_KEY,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: formData
            });

            if (!response.ok) throw new Error(`Dezgo error: ${response.status}`);

            const imageBuffer = await response.buffer();
            const base64Image = imageBuffer.toString('base64');
            
            return {
                success: true,
                imageUrl: `data:image/png;base64,${base64Image}`,
                service: 'dezgo'
            };
        } catch (error) {
            return { success: false, error: error.message, service: 'dezgo' };
        }
    }

    async generateImagePollinations(prompt) {
        try {
            const encodedPrompt = encodeURIComponent(prompt);
            const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&seed=${Date.now()}`;
            
            // Test if image loads
            const testResponse = await fetch(imageUrl);
            if (!testResponse.ok) throw new Error('Image generation failed');

            return {
                success: true,
                imageUrl: imageUrl,
                service: 'pollinations'
            };
        } catch (error) {
            return { success: false, error: error.message, service: 'pollinations' };
        }
    }

    // VIDEO GENERATION METHODS
    async generateVideoRunwayML(prompt) {
        try {
            const response = await fetch('https://api.runwayml.com/v1/image-to-video', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${process.env.RUNWAY_ML_API_TOKEN}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: 'gen3a_turbo',
                    prompt_text: prompt,
                    duration: 5,
                    ratio: '9:16' // Perfect for TikTok/Reels
                })
            });

            const data = await response.json();
            
            return {
                success: true,
                videoUrl: data.output,
                service: 'runway_ml'
            };
        } catch (error) {
            return { success: false, error: error.message, service: 'runway_ml' };
        }
    }

    async generateVideoPikaLabs(prompt) {
        try {
            const response = await fetch('https://api.pika.art/generate', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${process.env.PIKA_LABS_API_KEY}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prompt: prompt,
                    aspectRatio: '9:16',
                    duration: 3
                })
            });

            const data = await response.json();
            
            return {
                success: true,
                videoUrl: data.result.video_url,
                service: 'pika_labs'
            };
        } catch (error) {
            return { success: false, error: error.message, service: 'pika_labs' };
        }
    }

    async generateVideoHuggingFace(prompt) {
        try {
            const response = await fetch('https://api-inference.huggingface.co/models/damo-vilab/text-to-video-ms-1.7b', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${process.env.HUGGINGFACE_API_TOKEN}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    inputs: prompt,
                    parameters: {
                        num_frames: 16,
                        height: 576,
                        width: 1024
                    }
                })
            });

            if (response.status === 503) {
                // Model loading, try again later
                throw new Error('Model loading, try again later');
            }

            const videoBuffer = await response.buffer();
            const base64Video = videoBuffer.toString('base64');
            
            return {
                success: true,
                videoUrl: `data:video/mp4;base64,${base64Video}`,
                service: 'huggingface_video'
            };
        } catch (error) {
            return { success: false, error: error.message, service: 'huggingface_video' };
        }
    }

    async generateVideoLumaAI(prompt) {
        try {
            const response = await fetch('https://api.lumalabs.ai/dream-machine/v1/generations', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${process.env.LUMA_AI_API_KEY}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prompt: prompt,
                    aspect_ratio: '9:16',
                    loop: false
                })
            });

            const data = await response.json();
            
            return {
                success: true,
                videoUrl: data.video.download_url,
                service: 'luma_ai'
            };
        } catch (error) {
            return { success: false, error: error.message, service: 'luma_ai' };
        }
    }

    // MAIN GENERATION METHODS
    async generateImage(prompt) {
        const service = this.getNextAvailableService('images');
        
        console.log(`🎨 Generating image using ${service.name} (${service.used}/${service.limit} used)`);
        
        let result;
        
        switch (service.name) {
            case 'stability_ai':
                result = await this.generateImageStabilityAI(prompt);
                break;
            case 'replicate':
                result = await this.generateImageReplicate(prompt);
                break;
            case 'leonardo_ai':
                result = await this.generateImageLeonardoAI(prompt);
                break;
            case 'dezgo':
                result = await this.generateImageDezgo(prompt);
                break;
            case 'pollinations':
                result = await this.generateImagePollinations(prompt);
                break;
            default:
                return { success: false, error: 'No available service' };
        }

        if (result.success) {
            service.used++;
            await this.saveUsageData();
            console.log(`✅ Image generated successfully with ${service.name}`);
        } else {
            console.log(`❌ ${service.name} failed: ${result.error}`);
            // Try next service if this one failed
            if (service.used < service.limit) {
                service.active = false; // Temporarily disable failed service
                return this.generateImage(prompt);
            }
        }

        return result;
    }

    async generateVideo(prompt) {
        const service = this.getNextAvailableService('videos');
        
        console.log(`🎬 Generating video using ${service.name} (${service.used}/${service.limit} used)`);
        
        let result;
        
        switch (service.name) {
            case 'runway_ml':
                result = await this.generateVideoRunwayML(prompt);
                break;
            case 'pika_labs':
                result = await this.generateVideoPikaLabs(prompt);
                break;
            case 'huggingface_video':
                result = await this.generateVideoHuggingFace(prompt);
                break;
            case 'luma_ai':
                result = await this.generateVideoLumaAI(prompt);
                break;
            case 'veo_google':
                // Will implement when Google Veo API becomes available
                result = { success: false, error: 'Veo not yet available' };
                break;
            default:
                return { success: false, error: 'No available service' };
        }

        if (result.success) {
            service.used++;
            await this.saveUsageData();
            console.log(`✅ Video generated successfully with ${service.name}`);
        } else {
            console.log(`❌ ${service.name} failed: ${result.error}`);
            // Try next service if this one failed
            if (service.used < service.limit) {
                service.active = false; // Temporarily disable failed service
                return this.generateVideo(prompt);
            }
        }

        return result;
    }

    // CONTENT GENERATION FOR DROPSHIPPING
    async generateProductContent(productData) {
        const { title, description, niche } = productData;
        
        const imagePrompt = `Professional product photography of ${title}, ${description}, ${niche} style, high quality, commercial photography, white background, studio lighting`;
        
        const videoPrompt = `${title} product showcase, ${description}, dynamic camera movement, commercial advertisement style, ${niche} aesthetic, professional lighting`;

        const [imageResult, videoResult] = await Promise.allSettled([
            this.generateImage(imagePrompt),
            this.generateVideo(videoPrompt)
        ]);

        return {
            image: imageResult.status === 'fulfilled' ? imageResult.value : null,
            video: videoResult.status === 'fulfilled' ? videoResult.value : null,
            prompts: {
                image: imagePrompt,
                video: videoPrompt
            }
        };
    }

    // USAGE REPORTING
    getUsageReport() {
        const report = {
            images: {},
            videos: {}
        };

        ['images', 'videos'].forEach(type => {
            this.usageTracking[type].services.forEach(service => {
                report[type][service.name] = {
                    used: service.used,
                    limit: service.limit,
                    remaining: service.limit - service.used,
                    resetDate: service.resetDate,
                    status: service.active ? 'active' : 'disabled'
                };
            });
        });

        return report;
    }

    printUsageReport() {
        const report = this.getUsageReport();
        
        console.log('\n📊 API Usage Report:');
        console.log('===================');
        
        console.log('\n🎨 IMAGE SERVICES:');
        Object.entries(report.images).forEach(([name, data]) => {
            const percentage = Math.round((data.used / data.limit) * 100);
            console.log(`  ${name}: ${data.used}/${data.limit} (${percentage}%) - Reset: ${data.resetDate.toDateString()}`);
        });
        
        console.log('\n🎬 VIDEO SERVICES:');
        Object.entries(report.videos).forEach(([name, data]) => {
            const percentage = Math.round((data.used / data.limit) * 100);
            console.log(`  ${name}: ${data.used}/${data.limit} (${percentage}%) - Reset: ${data.resetDate.toDateString()}`);
        });
    }
}

export default FreeContentGenerator;
