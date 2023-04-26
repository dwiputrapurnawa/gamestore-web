import React from "react";
import { Carousel } from "antd";
import "../css/master.css";

const CarouselHeader = (props) => {
    return(
        <Carousel autoplay>

        {props.items.map((item,index) => {
            return <img key={index} className='carousel-img' src={item.src} alt="" />
        })}

       </Carousel>
    );
}

export default CarouselHeader;