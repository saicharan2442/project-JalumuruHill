
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, BookOpen } from "lucide-react";

// Mock data for Telugu God stories
const stories = [
  {
    id: 1,
    title: "The Story of Jalumuru Hill",
    summary: "The ancient legend behind the sacred Jalumuru Hill and why it became a divine destination for devotees.",
    image: "https://blogger.googleusercontent.com/img/a/AVvXsEiXxoE5c4sTGTgDFaeTD8cMqUfz9Ss4OkGkO5p1BkQPxHkwiVSmyjivHVTf3sbzaNrpOnLJ-xq8Bx6FlUgh1YhXdRX9GV_qhfwOlpcGRzhasDvFAbzgOQIDfsH2K2iJ0Cr-Uw5rr0axrupT4zgu2NOakcG_9HwvMPqkx9ok-vd7WgFk3BiWufAGEwb1Eh0=w1684-h1069-p-k-no-nu"
  },
  {
    id: 2,
    title: "The Birth of Lord Vinayaka",
    summary: "The fascinating story of how Goddess Parvati created Lord Ganesha and how he got his elephant head.",
    image: "https://blogger.googleusercontent.com/img/a/AVvXsEiXxoE5c4sTGTgDFaeTD8cMqUfz9Ss4OkGkO5p1BkQPxHkwiVSmyjivHVTf3sbzaNrpOnLJ-xq8Bx6FlUgh1YhXdRX9GV_qhfwOlpcGRzhasDvFAbzgOQIDfsH2K2iJ0Cr-Uw5rr0axrupT4zgu2NOakcG_9HwvMPqkx9ok-vd7WgFk3BiWufAGEwb1Eh0=w1684-h1069-p-k-no-nu"
  },
  {
    id: 3,
    title: "Lord Hanuman and the Sanjeevani Mountain",
    summary: "How Lord Hanuman carried an entire mountain to save Lord Lakshmana's life during the great war.",
    image: "https://blogger.googleusercontent.com/img/a/AVvXsEiXxoE5c4sTGTgDFaeTD8cMqUfz9Ss4OkGkO5p1BkQPxHkwiVSmyjivHVTf3sbzaNrpOnLJ-xq8Bx6FlUgh1YhXdRX9GV_qhfwOlpcGRzhasDvFAbzgOQIDfsH2K2iJ0Cr-Uw5rr0axrupT4zgu2NOakcG_9HwvMPqkx9ok-vd7WgFk3BiWufAGEwb1Eh0=w1684-h1069-p-k-no-nu"
  },
  {
    id: 4,
    title: "The Divine Dance of Lord Shiva",
    summary: "The cosmic dance of Lord Shiva as Nataraja and its profound spiritual significance in Hindu mythology.",
    image: "https://imgs.search.brave.com/VLZNgyJ9ddnhtP8ZGjx5LdVZIwTV60R4aD5y-FCCNgk/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9pMy53/cC5jb20vaGluZHUu/bXl0aG9sb2d5d29y/bGR3aWRlLmNvbS93/cC1jb250ZW50L3Vw/bG9hZHMvMjAyNC8x/MC9oaW5kdS5teXRo/b2xvZ3l3b3JsZHdp/ZGUuY29tLVRoZS1E/aXZpbmUtRGFuY2Ut/b2YtTG9yZC1TaGl2/YS1UaGUtU3Rvcnkt/b2YtSGlzLUFzY2Vu/ZGFuY2Uud2VicD93/PTEwMjQmcmVzaXpl/PTEwMjQsMTAyNCZz/c2w9MQ"
  }
];

const StoriesSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const visibleStories = 3; // Number of stories visible at once on desktop
  
  const nextSlide = () => {
    setActiveIndex((prevIndex) => 
      prevIndex + 1 >= stories.length ? 0 : prevIndex + 1
    );
  };
  
  const prevSlide = () => {
    setActiveIndex((prevIndex) => 
      prevIndex - 1 < 0 ? stories.length - 1 : prevIndex - 1
    );
  };
  
  // Create a circular array of stories based on the active index
  const displayedStories = [...stories.slice(activeIndex), ...stories.slice(0, activeIndex)]
    .slice(0, visibleStories);

  return (
    <div className="py-12 bg-white">
      <div className="temple-container">
        <h2 className="section-title">Rare Telugu Gods Stories</h2>
        
        <div className="relative">
          {/* Mobile view - single story slider */}
          <div className="md:hidden">
            <Card className="border-gold-light/30">
              <CardContent className="p-0">
                <div className="relative">
                  <img 
                    src={stories[activeIndex].image} 
                    alt={stories[activeIndex].title} 
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-4 text-white">
                    <h3 className="font-playfair text-xl font-semibold">{stories[activeIndex].title}</h3>
                  </div>
                </div>
                <div className="p-4">
                  <p className="mb-4">{stories[activeIndex].summary}</p>
                  <Link to="/ebooks" className="inline-flex items-center text-gold-dark hover:text-gold">
                    <span>Read More</span>
                    <BookOpen className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </CardContent>
            </Card>
            
            <div className="flex justify-center mt-4 space-x-2">
              {stories.map((_, index) => (
                <button
                  key={index}
                  className={`h-2 w-2 rounded-full ${
                    index === activeIndex ? "bg-gold" : "bg-gold-light/30"
                  }`}
                  onClick={() => setActiveIndex(index)}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
          
          {/* Desktop view - multi-story carousel */}
          <div className="hidden md:grid md:grid-cols-3 gap-6">
            {displayedStories.map((story) => (
              <Card key={story.id} className="card-hover border-gold-light/30">
                <CardContent className="p-0">
                  <div className="relative">
                    <img 
                      src={story.image} 
                      alt={story.title} 
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 p-4 text-white">
                      <h3 className="font-playfair text-xl font-semibold">{story.title}</h3>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="mb-4">{story.summary}</p>
                    <Link to="/ebooks" className="inline-flex items-center text-gold-dark hover:text-gold">
                      <span>Read More</span>
                      <BookOpen className="ml-2 h-4 w-4" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Navigation buttons for desktop */}
          <div className="hidden md:block">
            <Button 
              variant="outline" 
              size="icon" 
              className="absolute -left-4 top-1/2 transform -translate-y-1/2 bg-white border-gold-light/30 hover:bg-gold-light/20 z-10"
              onClick={prevSlide}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              className="absolute -right-4 top-1/2 transform -translate-y-1/2 bg-white border-gold-light/30 hover:bg-gold-light/20 z-10"
              onClick={nextSlide}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Navigation buttons for mobile */}
          <div className="md:hidden flex justify-center mt-6 space-x-4">
            <Button 
              variant="outline" 
              size="icon" 
              className="border-gold-light/30 hover:bg-gold-light/20"
              onClick={prevSlide}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              className="border-gold-light/30 hover:bg-gold-light/20"
              onClick={nextSlide}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoriesSection;
