class Storyboard {
    constructor(title, genre, description) {
      this.title = title;
      this.genre = genre;
      this.description = description;
      this.acts = {
        act1: {
          name: "Setup",
          description: "",
          scenes: [],
        },
        act2: {
          name: "Confrontation",
          description: "",
          scenes: [],
        },
        act3: {
          name: "Resolution",
          description: "",
          scenes: [],
        },
      };
    }


    
  
    // Method to add a description to an act
    addActDescription(actNumber, description) {
      if (this.acts[`act${actNumber}`]) {
        this.acts[`act${actNumber}`].description = description;
      }
    }
  
    // Method to add scenes to an act
    addSceneToAct(actNumber, scene) {
      if (this.acts[`act${actNumber}`]) {
        this.acts[`act${actNumber}`].scenes.push(scene);
      }
    }
  }
  
  // Example usage:
  const myFilm = new Storyboard("The Great Adventure", "Adventure", "A journey of self-discovery and adventure.");
  myFilm.addActDescription(1, "Introduce the protagonist and their world.");
  myFilm.addSceneToAct(1, { sceneTitle: "Introduction", location: "Protagonist's hometown", action: "Protagonist feels restless." });
  
  console.log(myFilm);
  