// YouTubeUploader.js - Real YouTube API Integration
import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import readline from 'readline'
import { SocialMediaManager } from './SocialMediaUploader.js';;

class YouTubeUploader {
  constructor() {
    this.youtube = null;
    this.oauth2Client = null;
    this.tokenPath = './youtube_token.json';
    this.credentialsPath = './youtube_credentials.json';
  }

  async initialize() {
    try {
      // Load client secrets from a local file
      const credentials = JSON.parse(fs.readFileSync(this.credentialsPath));
      const { client_secret, client_id, redirect_uris } = credentials.web || credentials.installed;

      this.oauth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

      // Check if we have previously stored a token
      if (fs.existsSync(this.tokenPath)) {
        const token = JSON.parse(fs.readFileSync(this.tokenPath));
        this.oauth2Client.setCredentials(token);
      } else {
        await this.getAccessToken();
      }

      this.youtube = google.youtube({ version: 'v3', auth: this.oauth2Client });
      console.log('✅ YouTube API initialized successfully');
      return true;
    } catch (error) {
      console.error('❌ YouTube initialization failed:', error.message);
      return false;
    }
  }

  async getAccessToken() {
    const authUrl = this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: ['https://www.googleapis.com/auth/youtube.upload'],
    });

    console.log('🔗 Authorize this app by visiting this URL:', authUrl);
    
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    return new Promise((resolve, reject) => {
      rl.question('📝 Enter the code from that page here: ', (code) => {
        rl.close();
        this.oauth2Client.getAccessToken(code, (err, token) => {
          if (err) {
            console.error('❌ Error retrieving access token', err);
            reject(err);
            return;
          }
          this.oauth2Client.setCredentials(token);
          // Store the token to disk for later program executions
          fs.writeFileSync(this.tokenPath, JSON.stringify(token));
          console.log('✅ Token stored to', this.tokenPath);
          resolve();
        });
      });
    });
  }

  async uploadVideo(videoPath, title, description = 'Auto-uploaded by AI automation', tags = ['ai', 'automation']) {
    try {
      if (!fs.existsSync(videoPath)) {
        throw new Error(`Video file not found: ${videoPath}`);
      }

      const fileSize = fs.statSync(videoPath).size;
      console.log(`📤 Uploading video: ${title} (${(fileSize / 1024 / 1024).toFixed(2)} MB)`);

      const response = await this.youtube.videos.insert({
        part: 'snippet,status',
        requestBody: {
          snippet: {
            title: title.slice(0, 100), // YouTube title limit
            description: description.slice(0, 5000), // YouTube description limit
            tags: tags,
            categoryId: '22', // People & Blogs
          },
          status: {
            privacyStatus: 'public', // or 'private', 'unlisted'
          },
        },
        media: {
          body: fs.createReadStream(videoPath),
        },
      });

      const videoId = response.data.id;
      const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
      
      console.log(`✅ YouTube upload successful!`);
      console.log(`📺 Video URL: ${videoUrl}`);
      
      return {
        success: true,
        videoId,
        videoUrl,
        title: response.data.snippet.title
      };

    } catch (error) {
      console.error('❌ YouTube upload failed:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

// TikTokUploader.js - Advanced Puppeteer Automation
import puppeteer from 'puppeteer';
import path from 'path';

class TikTokUploader {
  constructor() {
    this.browser = null;
    this.page = null;
  }

  async initialize(headless = false) {
    try {
      this.browser = await puppeteer.launch({
        headless: headless,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--disable-gpu'
        ]
      });

      this.page = await this.browser.newPage();
      await this.page.setViewport({ width: 1280, height: 720 });
      
      // Set user agent to avoid detection
      await this.page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
      
      console.log('✅ TikTok automation initialized');
      return true;
    } catch (error) {
      console.error('❌ TikTok initialization failed:', error.message);
      return false;
    }
  }

  async login(username, password) {
    try {
      await this.page.goto('https://www.tiktok.com/login', { waitUntil: 'networkidle2' });
      
      // Wait for login form
      await this.page.waitForSelector('input[name="username"]', { timeout: 10000 });
      
      // Fill login form
      await this.page.type('input[name="username"]', username);
      await this.page.type('input[name="password"]', password);
      
      // Click login button
      await this.page.click('button[type="submit"]');
      
      // Wait for navigation or CAPTCHA
      await this.page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 30000 });
      
      // Check if logged in successfully
      const isLoggedIn = await this.page.url().includes('tiktok.com/foryou') || 
                         await this.page.$('.avatar') !== null;
      
      if (isLoggedIn) {
        console.log('✅ TikTok login successful');
        return true;
      } else {
        console.log('⚠️ TikTok login may require manual verification (CAPTCHA/2FA)');
        return false;
      }
    } catch (error) {
      console.error('❌ TikTok login failed:', error.message);
      return false;
    }
  }

  async uploadVideo(videoPath, caption, hashtags = []) {
    try {
      if (!fs.existsSync(videoPath)) {
        throw new Error(`Video file not found: ${videoPath}`);
      }

      // Navigate to upload page
      await this.page.goto('https://www.tiktok.com/upload', { waitUntil: 'networkidle2' });
      
      // Wait for file input
      await this.page.waitForSelector('input[type="file"]', { timeout: 10000 });
      
      // Upload video file
      const fileInput = await this.page.$('input[type="file"]');
      await fileInput.uploadFile(videoPath);
      
      console.log('📤 Video file uploaded, processing...');
      
      // Wait for video processing
      await this.page.waitForSelector('.video-upload-container', { timeout: 60000 });
      
      // Add caption with hashtags
      const fullCaption = `${caption} ${hashtags.map(tag => `#${tag}`).join(' ')}`;
      await this.page.waitForSelector('div[contenteditable="true"]');
      await this.page.type('div[contenteditable="true"]', fullCaption);
      
      // Wait a moment for everything to load
      await this.page.waitForTimeout(3000);
      
      // Click post button
      await this.page.click('button[data-e2e="post-button"]');
      
      console.log('✅ TikTok upload initiated');
      
      // Wait for success confirmation
      await this.page.waitForSelector('.upload-success', { timeout: 30000 });
      
      return {
        success: true,
        message: 'TikTok video uploaded successfully'
      };

    } catch (error) {
      console.error('❌ TikTok upload failed:', error.message);
      
      // Take screenshot for debugging
      if (this.page) {
        await this.page.screenshot({ path: 'tiktok_error.png' });
        console.log('📸 Error screenshot saved as tiktok_error.png');
      }
      
      return {
        success: false,
        error: error.message
      };
    }
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
    }
  }
}

// SocialMediaManager.js - Main orchestrator
class SocialMediaManager {
  constructor() {
    this.youtubeUploader = new YouTubeUploader();
    this.tiktokUploader = new TikTokUploader();
  }

  async initialize() {
    console.log('🚀 Initializing Social Media Manager...');
    
    const youtubeReady = await this.youtubeUploader.initialize();
    const tiktokReady = await this.tiktokUploader.initialize(false); // Set to true for headless
    
    return {
      youtube: youtubeReady,
      tiktok: tiktokReady
    };
  }

  async uploadToAll(videoPath, title, description, hashtags = []) {
    const results = {
      youtube: null,
      tiktok: null
    };

    console.log('📤 Starting uploads to all platforms...');

    // Upload to YouTube
    try {
      results.youtube = await this.youtubeUploader.uploadVideo(videoPath, title, description);
    } catch (error) {
      console.error('YouTube upload error:', error);
      results.youtube = { success: false, error: error.message };
    }

    // Upload to TikTok (requires login first)
    try {
      // You'll need to implement login flow or handle it separately
      results.tiktok = await this.tiktokUploader.uploadVideo(videoPath, description, hashtags);
    } catch (error) {
      console.error('TikTok upload error:', error);
      results.tiktok = { success: false, error: error.message };
    }

    return results;
  }

  async uploadToYouTubeOnly(videoPath, title, description) {
    return await this.youtubeUploader.uploadVideo(videoPath, title, description);
  }

  async close() {
    await this.tiktokUploader.close();
  }
}

// Export for use in your server
export { YouTubeUploader, TikTokUploader, SocialMediaManager };

// Example usage in your server_with_ai.js:
/*
import { SocialMediaManager } from './SocialMediaUploader.js';

const socialMediaManager = new SocialMediaManager();
await socialMediaManager.initialize();

// In your enhanceProductWithAI function:
if (aiContent.files?.video) {
    const results = await socialMediaManager.uploadToAll(
        aiContent.files.video,
        productData.title || 'AI Generated Product Video',
        `Check out this amazing product: ${productData.description}`,
        ['ai', 'product', 'automation', productData.category]
    );
    
    console.log('Upload results:', results);
}
*/
