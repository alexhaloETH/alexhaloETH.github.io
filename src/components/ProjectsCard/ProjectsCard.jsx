import { motion, AnimatePresence } from "framer-motion";
import BaseCard from "../BaseCard/BaseCard";
import { projects } from "../../data/projects";
import { slideVariants } from "./ProjectsCard.animations";
import ProjectGallery from "./components/ProjectGallery";
import ProjectIndicators from "./components/ProjectIndicators";
import ProjectInfo from "./components/ProjectInfo";
import ProjectsHeader from "./components/ProjectsHeader";
import useProjectCarousel from "./useProjectCarousel";
import "./ProjectsCard.css";

function ProjectsCard() {
  const {
    currentIndex,
    direction,
    imageIndex,
    currentProject,
    paginate,
    goToProject,
    nextImage,
    prevImage,
    goToImage,
  } = useProjectCarousel(projects);

  return (
    <BaseCard className="card wide card-projects">
      <div className="projects-carousel">
        <ProjectsHeader
          currentIndex={currentIndex}
          totalProjects={projects.length}
          onPrev={() => paginate(-1)}
          onNext={() => paginate(1)}
        />

        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentProject.id}
            className="carousel-slide"
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="project-content">
              {/* Image gallery section */}
              <div className="project-gallery">
                <ProjectGallery
                  images={currentProject.images}
                  imageIndex={imageIndex}
                  onPrev={prevImage}
                  onNext={nextImage}
                  onSelectImage={goToImage}
                  title={currentProject.title}
                />
              </div>

              {/* Project info section */}
              <ProjectInfo project={currentProject} />
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Project indicators */}
        <ProjectIndicators
          projects={projects}
          currentIndex={currentIndex}
          onSelect={goToProject}
        />
      </div>
    </BaseCard>
  );
}

export default ProjectsCard;
