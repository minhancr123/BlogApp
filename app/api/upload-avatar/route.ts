import { NextRequest , NextResponse } from "next/server";
import formidable from "formidale";
import fs from "fs";
import path, { resolve } from "path";
import { validateRequest } from "@/app/auth";
import { prisma } from "@/app/lib/prisma";

export async function POST(req : NextRequest)
{
    const {user : loggedInUser} = validateRequest();
    if(!loggedInUser){
        return NextResponse.json({error : "Unauthorized"  } , {status : 401})
    }

    const form = formidable({uploadDir : "./public/upload"  , keepExtension : true});

    const data = await new Promise<{fields : any , files  : any }>((resolve , reject) => {
            form.parse(req as any , (err , fields , files) => {
            if(err) reject(err);
            resolve({fields, files})
        })
        }
    )

    const file = data.files.avatar[0];
    const filename = path.basename(file.filepath);

    return 
}