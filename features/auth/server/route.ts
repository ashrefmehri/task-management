import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { createAdminClient } from "@/lib/appwrite";
import { ID } from "node-appwrite";
import {deleteCookie, setCookie} from "hono/cookie"
import { sessionMiddleware } from "@/lib/session-middleware";
const app = new Hono()
.get("/current",sessionMiddleware, (c)=>{
  const user = c.get('user')
  return c.json({data:user})
})
  .post(
    "/login",
    zValidator(
      "json",
      z.object({
        email: z.string().email(),
        password: z.string(),
      })
    ),
   async (c) => {
      const { email, password } = c.req.valid("json");
      const {account} = await createAdminClient()

      const session = await account.createEmailPasswordSession(
        email,
        password,
      )

      setCookie(c,"task-management-app",session.secret,{
        path:"/",
        httpOnly:true,
        secure:true,
        sameSite:"strict",
        maxAge:60 * 60 * 24 * 30
      })


      return c.json({ success: true });
    }
  )
  .post(
    "/register",
    zValidator(
      "json",
      z.object({
        name: z.string().trim().min(1, "Please enter your name"),
        email: z.string().email(),
        password: z.string().min(8, "Minimum of 8 characters required"),
      }),
    ),
   async (c) => {
      const { name, email, password } = c.req.valid("json");
      const {account} = await createAdminClient()
      const user = await account.create(
        ID.unique(),
        email,
        password,
        name,
      )
      const session = await account.createEmailPasswordSession(
        email,
        password,
      )
     
      setCookie(c,"task-management-app",session.secret,{
        path:"/",
        httpOnly:true,
        secure:true,
        sameSite:"strict",
        maxAge:60 * 60 * 24 * 30
      })


    return c.json({ data: user });
    }
  )
  .post("/logout",sessionMiddleware,async (c)=>{

    const account = c.get("account")

    deleteCookie(c,"task-management-app")
    await account.deleteSession("current")
    return c.json({success:true})
  })

export default app;
