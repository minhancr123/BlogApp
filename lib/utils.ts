import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import {formatDate, formatDistanceStrict}  from "date-fns"
import React from "react";
import {InView} from "react-intersection-observer"



export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function FormatDateTime(from:  Date){
  const currentDate = new Date();
  if(currentDate.getTime()
      - from.getTime() < 24 * 60 * 60 * 1000){
    return formatDistanceStrict(currentDate , from , {addSuffix : true});
  }
  else{
    if(currentDate.getFullYear() == from.getFullYear()){
      return formatDate(from , 'MMM d');

    }
    else{
      return formatDate(from , 'MMM d, yyyy');
    }
  }
}

export const FormatNumber = (number : number, locate = "en-US"):string => {
    return Intl.NumberFormat(locate).format(number);
}

