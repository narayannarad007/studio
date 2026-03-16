import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Rocket, Send } from "lucide-react";

const messages = [
    { role: 'user', content: 'How can I improve my resume for a product manager role?' },
    { role: 'assistant', content: "Of course! Based on your resume, I'd suggest highlighting your experience in user research and data analysis. For example, you could rephrase the bullet point about 'market analysis' to 'drove product decisions by analyzing user feedback from 50+ interviews and 10,000 survey responses.'" },
    { role: 'user', content: 'That\'s helpful, thanks!' },
]

export default function AssistantPage() {
  return (
    <div className="flex flex-col h-[calc(100vh-100px)] gap-6">
       <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">AI Career Assistant</h1>
        <p className="text-muted-foreground">Your personal AI coach for resume advice, job search strategies, and more.</p>
      </div>

      <Card className="flex-1 flex flex-col">
        <CardHeader>
           <CardTitle className="flex items-center gap-2"><Rocket /> AI Assistant Chat</CardTitle>
           <CardDescription>Ask me anything about your job search.</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((msg, index) => (
                <div key={index} className={`flex items-start gap-4 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                    {msg.role === 'assistant' && (
                        <Avatar className="w-8 h-8">
                            <AvatarFallback>AI</AvatarFallback>
                        </Avatar>
                    )}
                     <div className={`rounded-lg px-4 py-2 max-w-[70%] ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                        <p>{msg.content}</p>
                    </div>
                     {msg.role === 'user' && (
                        <Avatar className="w-8 h-8">
                            <AvatarImage src="https://picsum.photos/seed/user-avatar/40/40" />
                            <AvatarFallback>AL</AvatarFallback>
                        </Avatar>
                    )}
                </div>
            ))}
        </CardContent>
        <div className="p-4 border-t">
          <div className="relative">
            <Input placeholder="Type your message..." className="pr-12" />
            <Button size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>

    </div>
  )
}
