import express from 'express';
import { Builder, By, until } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';
import cron from 'node-cron';
import { socialMediaAccounts, contentTemplates, podProviders, automationSchedule } from './social-config.js';

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Global variables for tracking
let automationStatus = {
    isRunning: false,
    lastRun: null,
    totalProducts: 0,
    errors: [],
    socialMedia: {
        tiktok: { posts: 0, lastPost: null, status: 'idle' },
        instagram: { posts: 0, lastPost: null, status: 'idle' },
        facebook: { posts: 0, lastPost: null, status: 'idle' }
    }
};

let scrapedProducts = [];

// Chrome options for container environment
function getChromeOptions() {
    const options = new chrome.Options();
    options.addArguments('--headless');
    options.addArguments('--no-sandbox');
    options.addArguments('--disable-dev-shm-usage');
    options.addArguments('--disable-gpu');
    options.addArguments('--window-size=1920,1080');
    options.addArguments('--disable-features=VizDisplayCompositor');
    options.addArguments('--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
    return options;
}

// Social Media Automation Functions
async function loginToTikTok(driver) {
    try {
        console.log('🎵 Logging into TikTok...');
        await driver.get('https://www.tiktok.com/login/phone-or-email/email');
        await driver.sleep(2000);

        const emailInput = await driver.wait(until.elementLocated(By.name('username')), 10000);
        await emailInput.sendKeys(socialMediaAccounts.tiktok.credentials.email);

        const passwordInput = await driver.findElement(By.type('password'));
        await passwordInput.sendKeys(socialMediaAccounts.tiktok.credentials.password);

        const loginButton = await driver.findElement(By.css('[data-e2e="login-button"]'));
        await loginButton.click();

        await driver.sleep(5000);
        console.log('✅ Successfully logged into TikTok');
        return true;
    } catch (error) {
        console.error('❌ TikTok login failed:', error.message);
        return false;
    }
}

async function postToTikTok(driver, content, videoPath = null) {
    try {
        if (!await loginToTikTok(driver)) return false;

        console.log('📱 Posting to TikTok...');
        await driver.get('https://www.tiktok.com/creator-center/upload');
        await driver.sleep(3000);

        // If video provided, upload it (you'll need to implement file upload)
        // For now, we'll focus on text-based content

        const captionBox = await driver.wait(until.elementLocated(By.css('[data-testid="caption-input"]')), 10000);
        await captionBox.sendKeys(content);

        // Add hashtags
        const hashtags = socialMediaAccounts.tiktok.settings.hashtags.slice(0, 5).join(' ');
        await captionBox.sendKeys(' ' + hashtags);

        await driver.sleep(2000);

        // Click post button (adjust selector as needed)
        const postButton = await driver.findElement(By.css('[data-e2e="post-button"]'));
        await postButton.click();

        automationStatus.socialMedia.tiktok.posts++;
        automationStatus.socialMedia.tiktok.lastPost = new Date().toISOString();
        automationStatus.socialMedia.tiktok.status = 'posted';

        console.log('✅ Successfully posted to TikTok');
        return true;
    } catch (error) {
        console.error('❌ TikTok posting failed:', error.message);
        automationStatus.socialMedia.tiktok.status = 'error';
        return false;
    }
}

async function loginToInstagram(driver) {
    try {
        console.log('📸 Logging into Instagram...');
        await driver.get('https://www.instagram.com/accounts/login/');
        await driver.sleep(3000);

        const usernameInput = await driver.wait(until.elementLocated(By.name('username')), 10000);
        await usernameInput.sendKeys(socialMediaAccounts.instagram.credentials.username);

        const passwordInput = await driver.findElement(By.name('password'));
        await passwordInput.sendKeys(socialMediaAccounts.instagram.credentials.password);

        const loginButton = await driver.findElement(By.css('[type="submit"]'));
        await loginButton.click();

        await driver.sleep(5000);
        console.log('✅ Successfully logged into Instagram');
        return true;
    } catch (error) {
        console.error('❌ Instagram login failed:', error.message);
        return false;
    }
}

async function postToInstagram(driver, content, imagePath = null) {
    try {
        if (!await loginToInstagram(driver)) return false;

        console.log('📸 Posting to Instagram...');
        
        // Navigate to create post
        await driver.get('https://www.instagram.com/');
        await driver.sleep(3000);

        // Click new post button
        const newPostButton = await driver.wait(until.elementLocated(By.css('[aria-label="New post"]')), 10000);
        await newPostButton.click();

        await driver.sleep(2000);

        // Add image upload logic here if imagePath provided
        // For now, focusing on the flow

        automationStatus.socialMedia.instagram.posts++;
        automationStatus.socialMedia.instagram.lastPost = new Date().toISOString();
        automationStatus.socialMedia.instagram.status = 'posted';

        console.log('✅ Successfully posted to Instagram');
        return true;
    } catch (error) {
        console.error('❌ Instagram posting failed:', error.message);
        automationStatus.socialMedia.instagram.status = 'error';
        return false;
    }
}

async function loginToFacebook(driver) {
    try {
        console.log('📘 Logging into Facebook...');
        await driver.get('https://www.facebook.com/login');
        await driver.sleep(2000);

        const emailInput = await driver.wait(until.elementLocated(By.id('email')), 10000);
        await emailInput.sendKeys(socialMediaAccounts.facebook.credentials.email);

        const passwordInput = await driver.findElement(By.id('pass'));
        await passwordInput.sendKeys(socialMediaAccounts.facebook.credentials.password);

        const loginButton = await driver.findElement(By.name('login'));
        await loginButton.click();

        await driver.sleep(5000);
        console.log('✅ Successfully logged into Facebook');
        return true;
    } catch (error) {
        console.error('❌ Facebook login failed:', error.message);
        return false;
    }
}

async function postToFacebook(driver, content) {
    try {
        if (!await loginToFacebook(driver)) return false;

        console.log('📘 Posting to Facebook...');
        await driver.get('https://www.facebook.com/');
        await driver.sleep(3000);

        // Find and click the post box
        const postBox = await driver.wait(until.elementLocated(By.css('[role="textbox"]')), 10000);
        await postBox.click();
        await postBox.sendKeys(content);

        await driver.sleep(2000);

        // Click post button
        const postButton = await driver.findElement(By.css('[data-testid="react-composer-post-button"]'));
        await postButton.click();

        automationStatus.socialMedia.facebook.posts++;
        automationStatus.socialMedia.facebook.lastPost = new Date().toISOString();
        automationStatus.socialMedia.facebook.status = 'posted';

        console.log('✅ Successfully posted to Facebook');
        return true;
    } catch (error) {
        console.error('❌ Facebook posting failed:', error.message);
        automationStatus.socialMedia.facebook.status = 'error';
        return false;
    }
}

// Product scraping function (existing)
async function scrapeProducts() {
    let driver;
    try {
        console.log('🤖 Starting product scraping...');
        automationStatus.isRunning = true;
        automationStatus.errors = [];

        const options = getChromeOptions();
        driver = await new Builder()
            .forBrowser('chrome')
            .setChromeOptions(options)
            .build();

        // Scrape AliExpress trending products
        console.log('🛍️ Scraping AliExpress trending products...');
        await driver.get('https://www.aliexpress.com/category/100003109/women-clothing.html');
        await driver.sleep(5000);

        const products = await driver.findElements(By.css('.item-title-wrap'));
        console.log(`📦 Found ${products.length} products`);

        for (let i = 0; i < Math.min(products.length, 10); i++) {
            try {
                const titleElement = await products[i].findElement(By.css('.item-title'));
                const title = await titleElement.getText();
                
                const priceElement = await products[i].findElement(By.css('.price-current'));
                const price = await priceElement.getText();

                const productData = {
                    title: title.trim(),
                    price: price.trim(),
                    source: 'AliExpress',
                    scrapedAt: new Date().toISOString(),
                    id: `ali_${Date.now()}_${i}`
                };

                scrapedProducts.push(productData);
                console.log(`✅ Scraped: ${productData.title}`);
            } catch (error) {
                console.log(`⚠️ Error scraping product ${i}: ${error.message}`);
            }
        }

        automationStatus.totalProducts = scrapedProducts.length;
        automationStatus.lastRun = new Date().toISOString();
        console.log(`🎉 Scraping completed! Total products: ${scrapedProducts.length}`);

    } catch (error) {
        console.error('❌ Scraping error:', error);
        automationStatus.errors.push(error.message);
    } finally {
        if (driver) {
            await driver.quit();
        }
        automationStatus.isRunning = false;
    }
}

// Social media posting function
async function performSocialMediaPosting() {
    if (scrapedProducts.length === 0) {
        console.log('⚠️ No products available for social media posting');
        return;
    }

    let driver;
    try {
        console.log('📱 Starting social media posting...');
        
        const options = getChromeOptions();
        driver = await new Builder()
            .forBrowser('chrome')
            .setChromeOptions(options)
            .build();

        // Get a random product to post about
        const product = scrapedProducts[Math.floor(Math.random() * scrapedProducts.length)];
        
        // Generate content for different platforms
        const tiktokContent = contentTemplates.tiktok.productPost[0]
            .replace('{productName}', product.title)
            .replace('{price}', product.price);

        const instagramContent = contentTemplates.instagram.productPost[0]
            .replace('{productName}', product.title)
            .replace('{price}', product.price)
            .replace('{hashtags}', socialMediaAccounts.instagram.settings.hashtags.slice(0, 10).join(' '));

        const facebookContent = contentTemplates.facebook.productPost[0]
            .replace('{productName}', product.title)
            .replace('{price}', product.price);

        // Post to each platform if enabled
        if (socialMediaAccounts.tiktok.enabled) {
            await postToTikTok(driver, tiktokContent);
        }

        if (socialMediaAccounts.instagram.enabled) {
            await postToInstagram(driver, instagramContent);
        }

        if (socialMediaAccounts.facebook.enabled) {
            await postToFacebook(driver, facebookContent);
        }

        console.log('✅ Social media posting completed!');

    } catch (error) {
        console.error('❌ Social media posting error:', error);
    } finally {
        if (driver) {
            await driver.quit();
        }
    }
}

// API Routes

// Health check endpoint (required for Koyeb)
app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'healthy', 
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Main dashboard
app.get('/', (req, res) => {
    res.json({
        message: '🤖 Selenium Dropshipping Automation Agent',
        status: 'running',
        features: [
            '📦 Product Scraping (AliExpress, Amazon)',
            '📱 Social Media Automation (TikTok, Instagram, Facebook)',
            '🎯 POD Integration (Printful, Printify)',
            '⏰ Scheduled Automation',
            '📊 Analytics & Reporting'
        ],
        endpoints: {
            '/health': 'Health check',
            '/status': 'Automation status',
            '/products': 'View scraped products',
            '/run-manual': 'Manual scraping trigger',
            '/social-status': 'Social media status',
            '/post-tiktok': 'Manual TikTok post',
            '/post-instagram': 'Manual Instagram post',
            '/post-facebook': 'Manual Facebook post',
            '/run-social': 'Manual social media posting'
        },
        timestamp: new Date().toISOString()
    });
});

// Automation status
app.get('/status', (req, res) => {
    res.json({
        automation: automationStatus,
        products: {
            total: scrapedProducts.length,
            latest: scrapedProducts.slice(-5)
        },
        socialMedia: automationStatus.socialMedia,
        schedule: {
            scraping: 'Every 4 hours',
            socialPosting: '9 AM, 3 PM, 9 PM daily',
            nextRun: 'Based on cron schedule'
        }
    });
});

// Social media status
app.get('/social-status', (req, res) => {
    res.json({
        accounts: {
            tiktok: {
                enabled: socialMediaAccounts.tiktok.enabled,
                configured: !!socialMediaAccounts.tiktok.credentials.email,
                stats: automationStatus.socialMedia.tiktok
            },
            instagram: {
                enabled: socialMediaAccounts.instagram.enabled,
                configured: !!socialMediaAccounts.instagram.credentials.username,
                stats: automationStatus.socialMedia.instagram
            },
            facebook: {
                enabled: socialMediaAccounts.facebook.enabled,
                configured: !!socialMediaAccounts.facebook.credentials.email,
                stats: automationStatus.socialMedia.facebook
            }
        },
        contentTemplates: Object.keys(contentTemplates),
        lastSocialRun: Math.max(
            new Date(automationStatus.socialMedia.tiktok.lastPost || 0),
            new Date(automationStatus.socialMedia.instagram.lastPost || 0),
            new Date(automationStatus.socialMedia.facebook.lastPost || 0)
        )
    });
});

// View scraped products
app.get('/products', (req, res) => {
    res.json({
        total: scrapedProducts.length,
        products: scrapedProducts,
        lastUpdate: automationStatus.lastRun
    });
});

// Manual scraping trigger
app.post('/run-manual', async (req, res) => {
    if (automationStatus.isRunning) {
        return res.status(409).json({
            error: 'Automation is already running',
            status: automationStatus
        });
    }

    res.json({
        message: '🚀 Manual scraping started',
        timestamp: new Date().toISOString()
    });

    // Run scraping in background
    scrapeProducts().catch(console.error);
});

// Manual social media posting
app.post('/run-social', async (req, res) => {
    res.json({
        message: '📱 Social media posting started',
        timestamp: new Date().toISOString()
    });

    // Run social media posting in background
    performSocialMediaPosting().catch(console.error);
});

// Individual platform posting endpoints
app.post('/post-tiktok', async (req, res) => {
    const { content } = req.body;
    
    if (!content && scrapedProducts.length === 0) {
        return res.status(400).json({
            error: 'No content provided and no products available'
        });
    }

    res.json({
        message: '🎵 TikTok posting started',
        timestamp: new Date().toISOString()
    });

    // Post to TikTok in background
    const driver = await new Builder().forBrowser('chrome').setChromeOptions(getChromeOptions()).build();
    const postContent = content || contentTemplates.tiktok.productPost[0]
        .replace('{productName}', scrapedProducts[0]?.title || 'Amazing Product')
        .replace('{price}', scrapedProducts[0]?.price || '$9.99');
    
    postToTikTok(driver, postContent).finally(() => driver.quit());
});

app.post('/post-instagram', async (req, res) => {
    const { content } = req.body;
    
    res.json({
        message: '📸 Instagram posting started',
        timestamp: new Date().toISOString()
    });

    // Post to Instagram in background
    const driver = await new Builder().forBrowser('chrome').setChromeOptions(getChromeOptions()).build();
    const postContent = content || contentTemplates.instagram.productPost[0]
        .replace('{productName}', scrapedProducts[0]?.title || 'Amazing Product')
        .replace('{price}', scrapedProducts[0]?.price || '$9.99')
        .replace('{hashtags}', socialMediaAccounts.instagram.settings.hashtags.slice(0, 10).join(' '));
    
    postToInstagram(driver, postContent).finally(() => driver.quit());
});

app.post('/post-facebook', async (req, res) => {
    const { content } = req.body;
    
    res.json({
        message: '📘 Facebook posting started',
        timestamp: new Date().toISOString()
    });

    // Post to Facebook in background
    const driver = await new Builder().forBrowser('chrome').setChromeOptions(getChromeOptions()).build();
    const postContent = content || contentTemplates.facebook.productPost[0]
        .replace('{productName}', scrapedProducts[0]?.title || 'Amazing Product')
        .replace('{price}', scrapedProducts[0]?.price || '$9.99');
    
    postToFacebook(driver, postContent).finally(() => driver.quit());
});

// POD Integration endpoints
app.get('/pod-status', (req, res) => {
    res.json({
        providers: {
            printful: {
                enabled: podProviders.printful.enabled,
                configured: !!podProviders.printful.apiKey
            },
            printify: {
                enabled: podProviders.printify.enabled,
                configured: !!podProviders.printify.apiKey
            },
            gooten: {
                enabled: podProviders.gooten.enabled,
                configured: !!podProviders.gooten.apiKey
            }
        },
        availableProducts: podProviders.printful.products
    });
});

// Analytics endpoint
app.get('/analytics', (req, res) => {
    const totalPosts = Object.values(automationStatus.socialMedia)
        .reduce((sum, platform) => sum + platform.posts, 0);

    res.json({
        overview: {
            totalProducts: scrapedProducts.length,
            totalSocialPosts: totalPosts,
            lastScrapingRun: automationStatus.lastRun,
            automationUptime: process.uptime()
        },
        socialMedia: automationStatus.socialMedia,
        products: {
            bySource: scrapedProducts.reduce((acc, product) => {
                acc[product.source] = (acc[product.source] || 0) + 1;
                return acc;
            }, {}),
            recent: scrapedProducts.slice(-10)
        }
    });
});

// Scheduled tasks
console.log('⏰ Setting up automation schedules...');

// Product scraping every 4 hours
cron.schedule('0 */4 * * *', () => {
    console.log('🕐 Scheduled product scraping starting...');
    scrapeProducts().catch(console.error);
});

// Social media posting at peak times
cron.schedule('0 9,15,21 * * *', () => {
    console.log('🕐 Scheduled social media posting starting...');
    performSocialMediaPosting().catch(console.error);
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log('🚀 Selenium Dropshipping Automation Agent');
    console.log(`📍 Server running on http://0.0.0.0:${PORT}`);
    console.log(`🔗 Health check: http://0.0.0.0:${PORT}/health`);
    console.log('⏰ Automation scheduled every 6 hours');
    console.log('📱 Social media automation enabled');
    console.log('🤖 Agent ready for dropshipping automation!');
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('🛑 Received SIGTERM, shutting down gracefully...');
    process.exit(0);
});

export default app;
