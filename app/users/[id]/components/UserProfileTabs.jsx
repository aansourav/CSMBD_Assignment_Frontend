import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserAbout from "./UserAbout";
import UserContent from "./UserContent";

export default function UserProfileTabs({ user }) {
    return (
        <Tabs defaultValue="content" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="about">About</TabsTrigger>
            </TabsList>

            <TabsContent value="content">
                <UserContent user={user} />
            </TabsContent>

            <TabsContent value="about">
                <UserAbout user={user} />
            </TabsContent>
        </Tabs>
    );
}
