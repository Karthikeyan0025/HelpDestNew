import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const troubleshootingVideos = {
    mouse: {
        url: 'https://youtu.be/uBoYxiynN0A?si=1soPoKB7gJp2B3U-',
        title: 'Mouse Troubleshooting Guide',
        category: 'hardware',
        keywords: ['mouse', 'clicking', 'cursor', 'pointer', 'scroll']
    },
    keyboard: {
        url: 'https://youtu.be/IFddlopXrIA?si=zYf4_wCXgh7s3d3V',    
        title: 'Keyboard Troubleshooting Guide',
        category: 'hardware',
        keywords: ['keyboard', 'typing', 'keys', 'spacebar']
    },
    systemPerformance: {
        url: 'https://www.youtube.com/watch?v=j2RW8Rt1nP4',
        title: 'System Performance Optimization',
        category: 'performance',
        keywords: ['slow', 'performance', 'speed', 'lag', 'freezing']
    },
    display: {
        url: 'https://www.youtube.com/watch?v=m3Bqh_EdgvI',
        title: 'Display Troubleshooting Guide',
        category: 'hardware',
        keywords: ['display', 'monitor', 'screen', 'resolution', 'flickering', 'no display']
    },
    printer: {
        url: 'https://www.youtube.com/watch?v=pK8a_Jsj3wE',
        title: 'Printer Troubleshooting Guide',
        category: 'hardware',
        keywords: ['printer', 'printing', 'paper jam', 'print quality', 'not printing']
    }
};

function findRelevantVideos(userMessage) {
    const message = userMessage.toLowerCase();
    return Object.values(troubleshootingVideos)
        .filter(video => 
            video.keywords.some(keyword => 
                message.includes(keyword.toLowerCase())
            )
        );
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { messages } = body;

    if (!messages || messages.length === 0) {
      return NextResponse.json({
        message: "Hello! I'm your IT support assistant. How may I help you today with your support ticket?"
      });
    }

    const userMessage = messages[messages.length - 1].content;
    const relevantVideos = findRelevantVideos(userMessage);
    
    console.log('Found relevant videos:', relevantVideos);

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful IT support assistant. Help users create and manage their support tickets effectively. Give in a catchy style."
        },
        ...messages
      ],
    });
    
    console.log('Sending response with videos:', {
      message: completion.choices[0].message.content,
      videos: relevantVideos.length > 0 ? relevantVideos.map(video => video.url) : null
    });

    return NextResponse.json({ 
      message: completion.choices[0].message.content,
      videos: relevantVideos.length > 0 ? relevantVideos.map(video => video.url) : null
    });
  } catch (error) {
    console.error('OpenAI API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 