"use client";
import { Menu } from "antd";
import React from 'react';
import { useState } from "react";
import "./nav.css"

export default function Nav({nowstate})
{
    const l=[]

    l.push( 
    <li><a href="#"><div className="now">我的课表</div></a></li>
    )

    l.push( 
        <li><a href="#">more</a></li>
        )
    l.push( 
        <li><a href="#">more</a></li>
        )
    l.push( 
        <li><a href="#">more</a></li>
        )
    l.push( 
        <li><a href="#">more</a></li>
        )
    return (
        <div>
        <div className="menu_all">
            我是导航栏
        </div>
        <div className="wi">
            <div className="frame">
                <ul>
                   {l}
                </ul>
            </div>

        </div>
      
        </div>
        
    )
}