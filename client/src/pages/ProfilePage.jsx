import React from 'react'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import Orders from '@/components/Profile/Orders'
import Address from '@/components/Profile/Address'
import Wishlist from '@/components/Profile/Wishlist'

const ProfilePage = () => {
  
  return (
     <Tabs defaultValue="tab-1" className="items-center py-6">
      <TabsList className="h-auto rounded-none border-b bg-transparent w-96 p-0">
        <TabsTrigger
          value="tab-1"
          className="data-[state=active]:after:bg-primary relative rounded-none cursor-pointer w-full py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
        >
        Order
        </TabsTrigger>
        <TabsTrigger
          value="tab-2"
          className="data-[state=active]:after:bg-primary relative rounded-none cursor-pointer  py-2 w-full  after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
        >
         Address
        </TabsTrigger>

         <TabsTrigger
          value="tab-3"
          className="data-[state=active]:after:bg-primary relative rounded-none py-2 cursor-pointer w-full after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
        >
         WishList
        </TabsTrigger>

        <TabsTrigger
          value="tab-4"
          className="data-[state=active]:after:bg-primary relative rounded-none py-2 cursor-pointer w-full after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
        >
         Logout
        </TabsTrigger>
      </TabsList>

      {/* <div className='w-full h-[1px] bg-black/30 my-4'></div> */}
      <TabsContent value="tab-1">
        <p className="text-muted-foreground p-4 text-center text-xs">
         <Orders/>
        </p>
      </TabsContent>
      <TabsContent value="tab-2">
        <p className="text-muted-foreground p-4 text-center text-xs">
         <Address/>
        </p>
      </TabsContent>
      <TabsContent value="tab-3">
        <p className="text-muted-foreground p-4 text-center text-xs">
          <Wishlist/>
        </p>
      </TabsContent>
        <TabsContent value="tab-4">
        <p className="text-muted-foreground p-4 text-center text-xs">
          Content for Tab 3
        </p>
      </TabsContent>
    </Tabs>
  )
}

export default ProfilePage
