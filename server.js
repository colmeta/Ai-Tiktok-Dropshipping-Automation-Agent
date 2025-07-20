import express from 'express';
import cron from 'node-cron';
import { Builder, By, Key, until } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';
import axios from 'axios';
import * as cheerio from 'cheerio';

const app = express();
const PORT = process.env.PORT || 8000;

// Configure Chrome options for headless operation
const getChromeOptions = () => {
    const options = new chrome.Options();
    
    // Essential Chrome flags for container environments
    options.addArguments(
        '--headless',
        '--no-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor',
        '--window-size=1920,1080',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-renderer-backgrounding'
    );
    
    // Set Chrome binary path for container
    if (process.env.CHROME_BIN) {
        options.setChromeBinaryPath(process.env.CHROME_BIN);
    }
    
    return options;
};

// Store automation status
let automationStatus = {
    isRunning: false,
    lastRun: null,
    totalProducts: 0,
    errors: [],
    products: []
};

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Health check endpoint (critical for Koyeb)
app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'healthy', 
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    });
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: '🤖 Selenium Dropshipping Automation Agent',
        status: 'active',
        version: '1.0.0',
        endpoints: {
            health: '/health',
            status: '/status',
            manual: '/run-manual',
            products: '/products'
        },
        automation: {
            isRunning: automationStatus.isRunning,
            lastRun: automationStatus.lastRun,
            totalProducts: automationStatus.totalProducts
        }
    });
});

// Status endpoint
app.get('/status', (req, res) => {
    res.json(automationStatus);
});

// Get products endpoint
app.get('/products', (req, res) => {
    res.json({
        products: automationStatus.products,
        total: automationStatus.totalProducts,
        lastUpdated: automationStatus.lastRun
    });
});

// Manual trigger endpoint
app.post('/run-manual', async (req, res) => {
    if (automationStatus.isRunning) {
        return res.status(400).json({ 
            error: 'Automation already running',
            status: automationStatus 
        });
    }

    try {
        res.json({ message: 'Manual automation started', timestamp: new Date() });
        await runAutomation();
    } catch (error) {
        console.error('Manual automation failed:', error);
        automationStatus.errors.push({
            timestamp: new Date(),
            error: error.message,
            type: 'manual'
        });
    }
});

// Main automation function
async function runAutomation() {
    if (automationStatus.isRunning) {
        console.log('⚠️  Automation already running, skipping...');
        return;
    }

    console.log('🚀 Starting dropshipping automation...');
    automationStatus.isRunning = true;
    automationStatus.lastRun = new Date();

    let driver = null;

    try {
        // Initialize WebDriver
        console.log('🔧 Initializing Chrome WebDriver...');
        driver = await new Builder()
            .forBrowser('chrome')
            .setChromeOptions(getChromeOptions())
            .build();

        console.log('✅ WebDriver initialized successfully');

        // Example: Scrape trending products from AliExpress
        await scrapeTrendingProducts(driver);

        // Example: Check competitors
        await checkCompetitors(driver);

        console.log('🎉 Automation completed successfully');

    } catch (error) {
        console.error('❌ Automation failed:', error);
        automationStatus.errors.push({
            timestamp: new Date(),
            error: error.message,
            stack: error.stack
        });
    } finally {
        if (driver) {
            try {
                await driver.quit();
                console.log('🔒 WebDriver closed');
            } catch (quitError) {
                console.error('Error closing WebDriver:', quitError);
            }
        }
        automationStatus.isRunning = false;
    }
}

// Scrape trending products
async function scrapeTrendingProducts(driver) {
    try {
        console.log('🔍 Scraping trending products...');
        
        // Navigate to AliExpress trending page
        await driver.get('https://www.aliexpress.com/');
        await driver.wait(until.titleContains('AliExpress'), 10000);

        console.log('📄 Page loaded successfully');

        // Wait for products to load
        await driver.sleep(3000);

        // Find product elements (adjust selectors as needed)
        const productElements = await driver.findElements(By.css('[data-widget-cid="widget-common-recommend"] .item'));
        
        console.log(`🛍️  Found ${productElements.length} products`);

        const products = [];
        const maxProducts = Math.min(5, productElements.length); // Limit to 5 products

        for (let i = 0; i < maxProducts; i++) {
            try {
                const element = productElements[i];
                
                // Extract product data
                const titleElement = await element.findElement(By.css('a[title]')).catch(() => null);
                const priceElement = await element.findElement(By.css('.price-current')).catch(() => null);
                const linkElement = await element.findElement(By.css('a')).catch(() => null);

                if (titleElement && priceElement && linkElement) {
                    const product = {
                        title: await titleElement.getAttribute('title'),
                        price: await priceElement.getText(),
                        link: await linkElement.getAttribute('href'),
                        scrapedAt: new Date()
                    };

                    products.push(product);
                    console.log(`📦 Product ${i + 1}: ${product.title}`);
                }
            } catch (productError) {
                console.log(`⚠️  Error processing product ${i + 1}:`, productError.message);
            }
        }

        // Update global status
        automationStatus.products = products;
        automationStatus.totalProducts = products.length;

        console.log(`✅ Successfully scraped ${products.length} products`);

    } catch (error) {
        console.error('❌ Error scraping products:', error);
        throw error;
    }
}

// Check competitor analysis
async function checkCompetitors(driver) {
    try {
        console.log('🔍 Performing competitor analysis...');
        
        // Example: Check a competitor store
        await driver.get('https://www.example-competitor.com/');
        await driver.sleep(2000);

        console.log('✅ Competitor analysis completed');

    } catch (error) {
        console.error('❌ Error in competitor analysis:', error);
        // Don't throw here, just log the error
    }
}

// Schedule automation to run every 6 hours
cron.schedule('0 */6 * * *', () => {
    console.log('⏰ Scheduled automation starting...');
    runAutomation();
});

// Graceful shutdown
process.on('SIGTERM', async () => {
    console.log('🛑 SIGTERM received, shutting down gracefully...');
    process.exit(0);
});

process.on('SIGINT', async () => {
    console.log('🛑 SIGINT received, shutting down gracefully...');
    process.exit(0);
});

// Start the server
const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Selenium Dropshipping Automation Agent`);
    console.log(`📍 Server running on http://0.0.0.0:${PORT}`);
    console.log(`🔗 Health check: http://0.0.0.0:${PORT}/health`);
    console.log(`⏰ Automation scheduled every 6 hours`);
    console.log(`🤖 Agent ready for dropshipping automation!`);
});

// Handle server errors
server.on('error', (error) => {
    console.error('❌ Server error:', error);
    process.exit(1);
});

export default app;
