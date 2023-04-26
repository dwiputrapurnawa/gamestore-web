import React, { useState } from 'react';
import Navbar from "./Navbar";
import { Divider, Col, Row } from "antd";
import Header from './Header';
import Product from './Product';
import CarouselHeader from "./Carousel_Header"
import CategoryItem from './Category_Item';
import Footer from './Footer';
import "../css/master.css";


const App = () => {

  const [wishlist, setWishlist] = useState(false);

  const toggleWishlist = () => {
    setWishlist(!wishlist);
  }

  const items = [
    {
      src: "https://cdn.eraspace.com/pub/media/mageplaza/blog/post/e/z/ezgif-1-769bdac2cc.jpg"
    },
    {
      src: "https://image.api.playstation.com/vulcan/ap/rnd/202211/0914/TvcIHkYqqln1RGbaFqBeuFp6.jpg"
    }
  ]

  const categoryItems = [
    {
      title: "Nintendo Switch",
      src: "https://media.wired.com/photos/61bd260a09d5d159e1c3bd68/4:3/w_1517,h_1137,c_limit/Gear-Nintendo-Switch-OLED.jpg"
    },
    {
      title: "Playstation 5",
      src: "https://cdn.shopify.com/s/files/1/2231/0539/products/PlayStation_205_20Console_20-_20Disc_20Version_ca22f902-4f1c-494d-93a9-325b5f9e03c5_700x700.png?v=1678099910"
    },
    {
      title: "Xbox Series",
      src: "https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RE4mRni?ver=a707"
    },
    {
      title: "Playstation 4",
      src: "https://www.pngmart.com/files/7/PS4-PNG-Image.png"
    }
  ]



  return(
    <div>
      <Navbar />

      <div className="content-container">
      
        <Header text="RECOMMENDED FOR YOU" />

        <CarouselHeader items={items} />

        <Divider />

        <Header text="SALE" />

        
        <Row gutter={20}>
          <Col className='col-container'>
            <Product title="PS5 - God of War Ragnarok" price="$69.99" wishlist={wishlist} toggle={toggleWishlist} />
          </Col>
        </Row>
        
        <Divider />

        <Header text="CATEGORY" />

        <Row gutter={20}>
        {categoryItems.map((item, index) => {
          return <Col key={index} className='col-container'>
          <CategoryItem src={item.src} title={item.title} />
          </Col>
        })}
        </Row>


      </div>

      <Footer />
    </div>
  )
}
export default App;
