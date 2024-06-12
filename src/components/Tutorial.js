import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './TutorialSlides.css'; 
import '@fortawesome/fontawesome-free/css/all.min.css';

const CustomNextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: 'block' }}
      onClick={onClick}
    >
      <i className="fas fa-chevron-right" />
    </div>
  );
};

const CustomPrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: 'block' }}
      onClick={onClick}
    >
      <i className="fas fa-chevron-left" />
    </div>
  );
};

const Tutorial = () => {
  const [modalIsOpen, setModalIsOpen] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    Modal.setAppElement('body');
  }, []);

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    afterChange: (index) => setCurrentSlide(index),
    nextArrow: <CustomNextArrow />,
    prevArrow: <CustomPrevArrow />,
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
      className="Modal"
      overlayClassName="Overlay"
    >
      <Slider {...settings}>
        <div>
          <h1>Welcome to Pathfinding Visualizer!</h1>
          <h2>This short tutorial will walk you through all of the features of this application.</h2>
         <h3>If you want to dive right in, feel free to press the "Skip Tutorial" button below.</h3>
        </div>
        <div>
          <h1>What is a pathfinding algorithm?</h1>
          <h2>At its core, a pathfinding algorithm seeks to find the shortest path between two points.</h2>
          <h3>This application visualizes Djikstra's algorithm in action</h3>
          <p>Dijkstra's Algorithm : the father of pathfinding algorithms; guarantees the shortest path</p>
        </div>
        <div>
          <h1>Adding walls</h1>
          <h2>Click on the grid to add a wall</h2>
          <h3>Walls are impenetrable, meaning that a path cannot cross through them.</h3>
        </div>
        <div>
          <h1>Enjoy!</h1>
          <h2>I hope you have just as much fun playing around with this visualization tool as I had building it!</h2>
          <h2>If you want to see the source code for this application, check out my github.</h2>
        </div>
      </Slider>
      {currentSlide < 1 && (
        <button className="cta" onClick={closeModal}>
          <span>Skip Tutorial</span>
          <svg width="15px" height="10px" viewBox="0 0 13 10">
            <path d="M1,5 L11,5"></path>
            <polyline points="8 1 12 5 8 9"></polyline>
          </svg>
        </button>
      )}
      <button className="cta" onClick={closeModal}>
        <span>Close</span>
        <svg width="15px" height="10px" viewBox="0 0 13 10">
          <path d="M1,5 L11,5"></path>
          <polyline points="8 1 12 5 8 9"></polyline>
        </svg>
      </button>
    </Modal>
  );
};

export default Tutorial;
