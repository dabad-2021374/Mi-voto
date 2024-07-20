import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const ImageCarousel = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 6500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: false
  };

  return (
    <div className="carousel-container">
      <Slider {...settings}>
        <div>
          <img src="https://agg.org.gt/wp-content/uploads/2020/01/Portada-programa-ci%CC%81vico-1200x675.png" alt="Imagen 1" className="carousel-image"/>
        </div>
        <div>
          <img src="https://lugaresantigua.com/assets/images/blog/23-007-datos-arco/1.jpg" alt="Imagen 2" className="carousel-image"/>
        </div>
        <div>
          <img src="https://historia.nationalgeographic.com.es/medio/2022/12/14/istock_cbc49c22_1225883927_221214131752_1280x808.jpg" alt="Imagen 3" className="carousel-image"/>
        </div>
      </Slider>
    </div>
  );
};

export default ImageCarousel;
