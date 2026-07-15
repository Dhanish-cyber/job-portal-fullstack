import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default async function ChatPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  // Mock chat data
  const contacts = [
    { id: 1, name: "Alice (Recruiter)", lastMessage: "Can we schedule an interview?", unread: true },
    { id: 2, name: "Bob (TechCorp)", lastMessage: "Your profile looks great.", unread: false },
  ];

  const messages = [
    { id: 1, sender: "Alice (Recruiter)", text: "Hi there! We reviewed your application for the Senior Frontend role.", time: "10:00 AM", isMe: false },
    { id: 2, sender: "You", text: "Hello Alice! Thanks for reaching out. I'm very excited about the opportunity.", time: "10:05 AM", isMe: true },
    { id: 3, sender: "Alice (Recruiter)", text: "Can we schedule an interview for tomorrow at 2 PM EST?", time: "10:10 AM", isMe: false },
  ];

  return (
    <div className="container mx-auto py-10 h-[calc(100vh-4rem)]">
      <div className="flex h-full gap-6">
        {/* Contacts Sidebar */}
        <div className="w-1/3 flex flex-col gap-4">
          <h2 className="text-2xl font-bold">Messages</h2>
          <div className="flex flex-col gap-2">
            {contacts.map(contact => (
              <Card key={contact.id} className={`cursor-pointer transition-colors hover:bg-muted/50 ${contact.id === 1 ? 'border-primary' : ''}`}>
                <CardContent className="p-4 flex justify-between items-center">
                  <div>
                    <h3 className={`font-medium ${contact.unread ? 'text-primary' : ''}`}>{contact.name}</h3>
                    <p className="text-sm text-muted-foreground truncate w-48">{contact.lastMessage}</p>
                  </div>
                  {contact.unread && (
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <Card className="flex-1 flex flex-col">
          <CardHeader className="border-b px-6 py-4">
            <CardTitle>{contacts[0].name}</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 p-6 flex flex-col gap-4 overflow-y-auto">
            {messages.map(msg => (
              <div key={msg.id} className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}>
                <div className={`px-4 py-2 rounded-2xl max-w-[80%] ${msg.isMe ? 'bg-primary text-primary-foreground rounded-tr-sm' : 'bg-muted rounded-tl-sm'}`}>
                  {msg.text}
                </div>
                <span className="text-xs text-muted-foreground mt-1 mx-1">{msg.time}</span>
              </div>
            ))}
          </CardContent>
          <div className="p-4 border-t flex gap-2">
            <Input placeholder="Type your message..." className="flex-1" />
            <Button>Send</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
