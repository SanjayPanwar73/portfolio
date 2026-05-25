// client/src/App.js
// Root component. Renders navbar + all page sections in order.
// ThemeProvider and Toaster live in index.js, so they are not duplicated here.

import Navbar   from "./components/Navbar/Navbar";
import Hero     from "./components/Hero/Hero";
import About    from "./components/About/About";
import Skills   from "./components/Skills/Skills";
import Projects from "./components/Projects/Projects";
import Contact  from "./components/Contact/Contact";
import Footer   from "./components/Footer/Footer";
import "./App.css";

function App() {
  return (
    <>
      <Navbar />
      <main>
        <section id="home">    <Hero />     </section>
        <section id="about">   <About />    </section>
        <section id="skills">  <Skills />   </section>
        <section id="projects"><Projects /> </section>
        <section id="contact"> <Contact />  </section>
      </main>
      <Footer />
    </>
  );
}

export default App;
