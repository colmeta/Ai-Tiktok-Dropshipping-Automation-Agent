// social-config.js - Add this to your project
export const socialMediaAccounts = {
    tiktok: {
        enabled: true,
        credentials: {
            email: process.env.TIKTOK_EMAIL || '', // Add to Koyeb environment variables
            password: process.env.TIKTOK_PASSWORD || '', // Add to Koyeb environment variables
        },
        settings: {
            autoPost: true,
            autoEngage: true,
            maxEngagementPerDay: 50,
            postingSchedule: ['09:00', '15:00', '21:00'], // Peak times
            hashtags: [
                '#dropshipping',
                '#trending',
                '#musthave',
                '#fyp',
                '#viral',
                '#deal',
                '#shopping',
                '#product',
                '#amazonfind',
                '#tiktokshop'
            ]
        }
    },
    
    instagram: {
        enabled: true,
        credentials: {
            username: process.env.INSTAGRAM_USERNAME || '',
            password: process.env.INSTAGRAM_PASSWORD || '',
        },
        settings: {
            autoPost: true,
            autoStory: true,
            autoEngage: true,
            maxEngagementPerDay: 100,
            postingSchedule: ['10:00', '14:00', '18:00', '22:00'],
            hashtags: [
                '#dropshipping',
                '#onlinebusiness',
                '#entrepreneur',
                '#ecommerce',
                '#trending',
                '#musthave',
                '#deal',
                '#shopping',
                '#business',
                '#success'
            ]
        }
    },
    
    facebook: {
        enabled: true,
        credentials: {
            email: process.env.FACEBOOK_EMAIL || '',
            password: process.env.FACEBOOK_PASSWORD || '',
        },
        settings: {
            autoPost: true,
            postToGroups: true,
            targetGroups: [
                'Dropshipping Success',
                'Ecommerce Entrepreneurs',
                'Online Business Tips'
            ],
            postingSchedule: ['11:00', '16:00', '20:00']
        }
    },
    
    twitter: {
        enabled: false, // Set to true when ready
        credentials: {
            username: process.env.TWITTER_USERNAME || '',
            password: process.env.TWITTER_PASSWORD || '',
        },
        settings: {
            autoTweet: true,
            autoRetweet: true,
            maxTweetsPerDay: 20,
            hashtags: [
                '#dropshipping',
                '#ecommerce',
                '#entrepreneur',
                '#business',
                '#trending'
            ]
        }
    }
};

// Content templates for different platforms
export const contentTemplates = {
    tiktok: {
        productPost: [
            "🔥 Found this amazing {productName}! Price: {price} 💰 What do you think? #trending #musthave",
            "This {productName} is going viral! 🚀 Only {price} - should I get it? #fyp #viral",
            "POV: You found the perfect {productName} for {price} 😍 Link in bio! #deal #shopping"
        ],
        engagementPost: [
            "Drop a 🔥 if you want to see more products like this!",
            "Comment your favorite color and I'll find you the perfect match! 💕",
            "Which one would you choose? A or B? Let me know! 👇"
        ]
    },
    
    instagram: {
        productPost: [
            "✨ NEW FIND ALERT ✨\n{productName}\n💰 Price: {price}\n🛒 Link in bio\n\n{hashtags}",
            "Obsessed with this {productName}! 😍\nOnly {price} and the quality is amazing!\n\n{hashtags}",
            "Your next must-have: {productName} 💎\nSwipe to see all the details ➡️\n\n{hashtags}"
        ],
        storyTemplates: [
            "🛍️ Today's find: {productName}",
            "💰 Amazing deal: {price}",
            "🔥 Trending now"
        ]
    },
    
    facebook: {
        productPost: [
            "🌟 PRODUCT SPOTLIGHT 🌟\n\nI just discovered this incredible {productName}!\n\n💰 Price: {price}\n📦 Fast shipping\n⭐ Great reviews\n\nWhat do you think? Would you try it?\n\n{hashtags}",
            "Hey everyone! 👋\n\nFound another gem: {productName}\n\nAt {price}, this is such a great deal! Perfect for {season/occasion}.\n\nWho else loves finding good deals? 🙋‍♀️"
        ]
    }
};

// POD (Print-on-Demand) provider configurations
export const podProviders = {
    printful: {
        enabled: true,
        baseUrl: 'https://api.printful.com',
        // You'll need to get these from Printful dashboard
        apiKey: process.env.PRINTFUL_API_KEY || '',
        storeId: process.env.PRINTFUL_STORE_ID || '',
        products: [
            'unisex-tshirt',
            'hoodie', 
            'mug',
            'phone-case',
            'poster'
        ]
    },
    
    printify: {
        enabled: false,
        baseUrl: 'https://api.printify.com/v1',
        apiKey: process.env.PRINTIFY_API_KEY || '',
        shopId: process.env.PRINTIFY_SHOP_ID || ''
    },
    
    gooten: {
        enabled: false,
        baseUrl: 'https://api.gooten.com/v2',
        apiKey: process.env.GOOTEN_API_KEY || ''
    }
};

// Automation schedule configuration
export const automationSchedule = {
    productScraping: '0 */4 * * *', // Every 4 hours
    socialMediaPosting: '0 9,15,21 * * *', // 9 AM, 3 PM, 9 PM
    engagement: '0 */2 * * *', // Every 2 hours
    analytics: '0 0 * * *', // Daily at midnight
    
    // Days of week for posting (0 = Sunday, 1 = Monday, etc.)
    activeDays: [1, 2, 3, 4, 5, 6, 7], // All days
    
    // Posting limits per day
    limits: {
        tiktok: 5,
        instagram: 3,
        facebook: 2,
        twitter: 10
    }
};

// Trending keywords for different niches
export const trendingKeywords = {
    general: [
        'viral products',
        'must have items',
        'trending now',
        'amazon finds',
        'dropshipping products'
    ],
    
    fashion: [
        'fashion trends',
        'outfit ideas',
        'style inspiration',
        'fashion haul'
    ],
    
    tech: [
        'tech gadgets',
        'cool inventions',
        'smart devices',
        'tech review'
    ],
    
    home: [
        'home decor',
        'home improvement',
        'organization',
        'home gadgets'
    ],
    
    beauty: [
        'beauty products',
        'skincare routine',
        'makeup haul',
        'beauty tips'
    ]
};
