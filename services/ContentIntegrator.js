// This bridges your Selenium automation with content generation
import FreeContentGenerator from './FreeContentGenerator.js';
import { writeFile } from 'fs/promises';
import path from 'path';

class ContentIntegrator {
    constructor() {
        this.contentGen = new FreeContentGenerator();
    }

    // Generate content for your Selenium automation
    async generateForProduct(productData, outputDir = './generated_content') {
        try {
            const content = await this.contentGen.generateProductContent(productData);
            
            // Save files for Selenium to use
            const timestamp = Date.now();
            const productSlug = productData.title.toLowerCase().replace(/[^a-z0-9]/g, '-');
            
            const files = {
                image: null,
                video: null
            };

            if (content.image && content.image.success) {
                const imagePath = path.join(outputDir, `${productSlug}-${timestamp}.png`);
                
                if (content.image.imageUrl.startsWith('data:')) {
                    // Base64 image
                    const base64Data = content.image.imageUrl.split(',')[1];
                    await writeFile(imagePath, base64Data, 'base64');
                } else {
                    // URL image - download it
                    const response = await fetch(content.image.imageUrl);
                    const buffer = await response.buffer();
                    await writeFile(imagePath, buffer);
                }
                
                files.image = imagePath;
            }

            if (content.video && content.video.success) {
                const videoPath = path.join(outputDir, `${productSlug}-${timestamp}.mp4`);
                
                if (content.video.videoUrl.startsWith('data:')) {
                    // Base64 video
                    const base64Data = content.video.videoUrl.split(',')[1];
                    await writeFile(videoPath, base64Data, 'base64');
                } else {
                    // URL video - download it
                    const response = await fetch(content.video.videoUrl);
                    const buffer = await response.buffer();
                    await writeFile(videoPath, buffer);
                }
                
                files.video = videoPath;
            }

            return {
                success: true,
                files: files,
                serviceUsed: {
                    image: content.image?.service,
                    video: content.video?.service
                }
            };

        } catch (error) {
            console.error('❌ Content generation error:', error);
            return { success: false, error: error.message };
        }
    }

    // Get usage report for monitoring
    getUsageReport() {
        return this.contentGen.getUsageReport();
    }
}

export default ContentIntegrator;
