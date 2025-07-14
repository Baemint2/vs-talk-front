import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs.tsx"
import { useState } from "react";
import YouTube, {type YouTubeProps } from 'react-youtube';
import Vote from "../components/vote/Vote.tsx"

// Home.tsx
const Home = () => {
    const [videoId] = useState<string>('');

    const onPlayerReady: YouTubeProps['onReady'] = (event) => {
        event.target.pauseVideo();
    }
    const opts: YouTubeProps['opts'] = {
        height: '390',
        width: '640',
        playerVars: {
            autoplay: 1,
        },
    };

    return <>
        <Tabs defaultValue="account" className="p-1 rounded-lg">
            <TabsList>
                <TabsTrigger value="account" className="bg-blue-500 text-white hover:bg-blue-600">
                    스포츠
                </TabsTrigger>
                <TabsTrigger value="password" className="bg-green-500 text-white hover:bg-green-600">
                    주류
                </TabsTrigger>
            </TabsList>
            <TabsContent value="account">Make changes to your account here.</TabsContent>
            <TabsContent value="password">Change your password here.</TabsContent>
        </Tabs>
    <div className={"flex flex-col items-center gap-4"} style={{height: '100vh'}}>
        { videoId === null ? null :
            (<YouTube
                videoId={videoId}
                opts={opts}
                onReady={onPlayerReady}
                className="flex justify-center"/>)
        }
        <Vote />
    </div>
    </>
};

export default Home;
