// tiktok-automation.js - Add this to your project
import { By, until, Key } from 'selenium-webdriver';
import fs from 'fs';
import path from 'path';

class TikTokAutomation {
    constructor(driver) {
        this.driver = driver;
        this.isLoggedIn = false;
    }

    // Login to TikTok account
    async login(username, password) {
        try {
            console.log('🔐 Logging into TikTok...');
            
            await this.driver.get('https://www.tiktok.com/login/phone-or-email/email');
            await this.driver.sleep(3000);

            // Handle login form
            const emailInput = await this.driver.wait(
                until.elementLocated(By.name('username')), 
                10000
            );
            await emailInput.sendKeys(username);

            const passwordInput = await this.driver.findElement(By.css('input[type="password"]'));
            await passwordInput.sendKeys(password);

            // Click login button
            const loginButton = await this.driver.findElement(By.css('button[data-e2e="login-button"]'));
            await loginButton.click();

            // Wait for successful login (check for profile or upload button)
            try {
                await this.driver.wait(
                    until.elementLocated(By.css('[data-e2e="upload-icon"]')), 
                    15000
                );
                this.isLoggedIn = true;
                console.log('✅ Successfully logged into TikTok');
                return true;
            } catch (error) {
                // Handle CAPTCHA or verification
                console.log('⚠️  Login may require verification - check manually');
                await this.driver.sleep(30000); // Wait for manual verification
                this.isLoggedIn = true;
                return true;
            }

        } catch (error) {
            console.error('❌ TikTok login failed:', error.message);
            return false;
        }
    }

    // Post a product video to TikTok
    async postProduct(productData, videoPath, caption) {
        if (!this.isLoggedIn) {
            throw new Error('Not logged into TikTok');
        }

        try {
            console.log('📱 Starting TikTok post creation...');

            // Navigate to upload page
            await this.driver.get('https://www.tiktok.com/upload');
            await this.driver.sleep(5000);

            // Upload video file
            const fileInput = await this.driver.wait(
                until.elementLocated(By.css('input[type="file"]')), 
                10000
            );
            
            await fileInput.sendKeys(path.resolve(videoPath));
            console.log('📹 Video uploaded');

            // Wait for video processing
            await this.driver.sleep(10000);

            // Add caption with product info and hashtags
            const captionText = this.generateCaption(productData, caption);
            const captionInput = await this.driver.wait(
                until.elementLocated(By.css('[data-text="true"]')), 
                15000
            );
            
            await captionInput.click();
            await captionInput.sendKeys(captionText);
            console.log('📝 Caption added');

            // Set privacy settings (optional)
            await this.setPrivacySettings();

            // Schedule or post immediately
            const postButton = await this.driver.findElement(By.css('[data-e2e="post-button"]'));
            await postButton.click();

            console.log('🎉 Product posted to TikTok successfully!');
            return true;

        } catch (error) {
            console.error('❌ Failed to post to TikTok:', error.message);
            return false;
        }
    }

    // Generate engaging caption with hashtags
    generateCaption(productData, customCaption = '') {
        const hashtags = [
            '#dropshipping',
            '#trending',
            '#musthave',
            '#deal',
            '#shopping',
            '#fyp',
            '#viral',
            '#product',
            '#amazonfind',
            '#tiktokshop'
        ];

        const caption = customCaption || `🔥 Found this amazing ${productData.title}! 

💰 Price: ${productData.price}
🛒 Link in bio!

What do you think? Comment below! 👇`;

        return `${caption}\n\n${hashtags.join(' ')}`;
    }

    // Set privacy and commenting settings
    async setPrivacySettings() {
        try {
            // Allow comments
            const commentsToggle = await this.driver.findElement(
                By.css('[data-e2e="comment-toggle"]')
            ).catch(() => null);
            
            if (commentsToggle) {
                const isEnabled = await commentsToggle.getAttribute('aria-checked');
                if (isEnabled === 'false') {
                    await commentsToggle.click();
                }
            }

            // Set to public
            const publicOption = await this.driver.findElement(
                By.css('[data-e2e="public-option"]')
            ).catch(() => null);
            
            if (publicOption) {
                await publicOption.click();
            }

        } catch (error) {
            console.log('⚠️  Could not set privacy settings:', error.message);
        }
    }

    // Get trending hashtags for better reach
    async getTrendingHashtags() {
        try {
            await this.driver.get('https://www.tiktok.com/discover');
            await this.driver.sleep(3000);

            const hashtagElements = await this.driver.findElements(
                By.css('[data-e2e="challenge-item"]')
            );

            const hashtags = [];
            for (let i = 0; i < Math.min(5, hashtagElements.length); i++) {
                const hashtag = await hashtagElements[i].getText();
                if (hashtag.startsWith('#')) {
                    hashtags.push(hashtag);
                }
            }

            return hashtags;
        } catch (error) {
            console.log('⚠️  Could not fetch trending hashtags:', error.message);
            return [];
        }
    }

    // Auto-engage with similar content for growth
    async autoEngage(keywords, maxActions = 10) {
        try {
            console.log('🤖 Starting auto-engagement...');
            
            // Search for content related to your niche
            await this.driver.get(`https://www.tiktok.com/search?q=${encodeURIComponent(keywords.join(' '))}`);
            await this.driver.sleep(5000);

            const videos = await this.driver.findElements(By.css('[data-e2e="search-video-item"]'));
            let actions = 0;

            for (let i = 0; i < Math.min(maxActions, videos.length); i++) {
                try {
                    await videos[i].click();
                    await this.driver.sleep(3000);

                    // Like the video
                    const likeButton = await this.driver.findElement(
                        By.css('[data-e2e="like-button"]')
                    ).catch(() => null);
                    
                    if (likeButton) {
                        await likeButton.click();
                        actions++;
                        console.log(`👍 Liked video ${i + 1}`);
                    }

                    // Follow user occasionally (be careful not to spam)
                    if (Math.random() < 0.3) { // 30% chance
                        const followButton = await this.driver.findElement(
                            By.css('[data-e2e="follow-button"]')
                        ).catch(() => null);
                        
                        if (followButton) {
                            await followButton.click();
                            console.log(`➕ Followed user ${i + 1}`);
                        }
                    }

                    await this.driver.sleep(2000);
                    await this.driver.navigate().back();
                    await this.driver.sleep(2000);

                } catch (error) {
                    console.log(`⚠️  Error engaging with video ${i + 1}:`, error.message);
                }
            }

            console.log(`✅ Auto-engagement completed: ${actions} actions`);
            return actions;

        } catch (error) {
            console.error('❌ Auto-engagement failed:', error.message);
            return 0;
        }
    }

    // Monitor performance of posted content
    async getPostAnalytics() {
        try {
            await this.driver.get('https://www.tiktok.com/creator-center/analytics');
            await this.driver.sleep(5000);

            // Get basic metrics
            const views = await this.driver.findElement(By.css('[data-e2e="video-views"]'))
                .getText().catch(() => '0');
            const likes = await this.driver.findElement(By.css('[data-e2e="video-likes"]'))
                .getText().catch(() => '0');
            const shares = await this.driver.findElement(By.css('[data-e2e="video-shares"]'))
                .getText().catch(() => '0');

            return {
                views,
                likes,
                shares,
                timestamp: new Date()
            };

        } catch (error) {
            console.log('⚠️  Could not fetch analytics:', error.message);
            return null;
        }
    }

    // Logout safely
    async logout() {
        try {
            await this.driver.get('https://www.tiktok.com/setting');
            await this.driver.sleep(3000);

            const logoutButton = await this.driver.findElement(
                By.css('[data-e2e="logout-button"]')
            ).catch(() => null);

            if (logoutButton) {
                await logoutButton.click();
                this.isLoggedIn = false;
                console.log('👋 Logged out of TikTok');
            }

        } catch (error) {
            console.log('⚠️  Logout error:', error.message);
        }
    }
}

export default TikTokAutomation;
