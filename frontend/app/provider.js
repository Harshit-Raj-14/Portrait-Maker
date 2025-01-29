"use client"
import { useUser } from '@clerk/nextjs'
import { Users } from '../configs/schema';
import {eq} from 'drizzle-orm';
import React, { useEffect } from 'react';
// import  db  from "@/configs/db";
import { db } from '../configs/db';

function Provider({children}) {

  const {user} = useUser();

  useEffect(() =>{  //when first time called check for user, if not then add new user
    user && isNewUser();
  },[user]);

  //check is user => is new user
  const isNewUser = async() =>{
    const result = await db.select().from(Users).where(eq(Users.email, user?.primaryEmailAddress?.emailAddress));

    console.log(result);

    if(!result[0]){ //in case no email found, add the new user to db
      await db.insert(Users).values({
        name:user.fullName,
        email:user?.primaryEmailAddress?.emailAddress,
        imageUrl:user?.imageUrl
      })
    }
  }

  return (
    <div>
        {children}
    </div>
  )
}

export default Provider