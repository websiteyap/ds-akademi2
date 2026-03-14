"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Briefcase,
  GraduationCap,
  Award,
  ChevronRight,
  User,
  BookOpen,
  Mail,
  Linkedin,
  Twitter,
  Globe
} from "lucide-react";
import { type Instructor } from "@/data/instructors";
import { courses } from "@/data/courses";
import Breadcrumb from "@/components/Breadcrumb";

interface Props {
  instructor: Instructor;
}

export default function InstructorDetailClient({ instructor }: Props) {
  // Find courses taught by this instructor (fuzzy match)
  const instructorCourses = courses.filter((c) =>
    c.instructor.includes(instructor.name) || instructor.name.includes(c.instructor)
  );

  return (
    <article className="instructor-profile-page">
      <Breadcrumb 
        items={[
          { label: 'Eğitmenler', href: '/egitmenler' },
          { label: instructor.name }
        ]} 
      />

      <div className="container">
        <div className="instructor-profile-grid">
          
          {/* Left Sidebar: Photo and Contact Info */}
          <aside className="instructor-profile-sidebar">
            <div className="instructor-profile-card">
              <div className="instructor-img-large-wrap">
                <Image
                  src={instructor.image}
                  alt={instructor.name}
                  fill
                  className="instructor-img-large"
                  sizes="(max-width: 768px) 100vw, 350px"
                  priority
                />
              </div>
              <div className="instructor-info-box">
                <span className="instructor-badge">
                  <Award size={14} />
                  {instructor.title}
                </span>
                <h1 className="instructor-name">{instructor.name}</h1>
                <p className="instructor-department">{instructor.department}</p>
                
                {instructor.socials && (
                  <div className="instructor-socials">
                    {instructor.socials.linkedin && (
                      <a href={instructor.socials.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                        <Linkedin size={18} />
                      </a>
                    )}
                    {instructor.socials.twitter && (
                      <a href={instructor.socials.twitter} target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                        <Twitter size={18} />
                      </a>
                    )}
                    {instructor.socials.website && (
                      <a href={instructor.socials.website} target="_blank" rel="noopener noreferrer" aria-label="Website">
                        <Globe size={18} />
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            <div className="instructor-contact-card">
              <h3>İletişime Geç</h3>
              <p>Kurumsal eğitim talepleri ve sorularınız için iletişime geçebilirsiniz.</p>
              <Link href="/iletisim" className="primary-btn outline" style={{width: '100%', justifyContent: 'center', marginTop: '1rem'}}>
                <Mail size={16}/>
                Mesaj Gönder
              </Link>
            </div>
          </aside>

          {/* Right Content: Bio, Academic Details, Courses */}
          <div className="instructor-profile-content">
            
            <section className="profile-section">
              <h2 className="profile-section-title">
                <User size={22} className="text-accent" />
                Biyografi
              </h2>
              <div className="profile-bio-text">
                <p>{instructor.bio}</p>
              </div>
            </section>

            <section className="profile-section">
              <h2 className="profile-section-title">
                <GraduationCap size={22} className="text-accent" />
                Eğitim Bilgileri
              </h2>
              <div className="academic-timeline">
                {instructor.education.map((edu, idx) => (
                  <div key={idx} className="timeline-item">
                    <div className="timeline-dot"></div>
                    <div className="timeline-content">
                       <span className="timeline-year">{edu.year}</span>
                       <h4 className="timeline-title">{edu.degree}</h4>
                       <p className="timeline-desc">{edu.university}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="profile-section">
              <h2 className="profile-section-title">
                <Briefcase size={22} className="text-accent" />
                Deneyim
              </h2>
              <div className="academic-timeline">
                {instructor.experience.map((exp, idx) => (
                  <div key={idx} className="timeline-item">
                    <div className="timeline-dot"></div>
                    <div className="timeline-content">
                       <span className="timeline-year">{exp.duration}</span>
                       <h4 className="timeline-title">{exp.role}</h4>
                       <p className="timeline-desc">{exp.institution}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
            
            {/* Instructor's Courses */}
            {instructorCourses.length > 0 && (
              <section className="profile-section mt-5">
                <h2 className="profile-section-title">
                  <BookOpen size={22} className="text-accent" />
                  Verdiği Eğitimler
                </h2>
                <div className="instructor-courses-grid">
                  {instructorCourses.map(course => (
                    <Link
                      href={`/kurslar/${course.slug}`}
                      key={course.id}
                      className="course-card"
                    >
                      <div className="course-card-img-wrap">
                        <Image
                          src={course.image}
                          alt={course.title}
                          fill
                          className="course-card-img"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                        <div className="course-card-overlay" />
                        <div className="course-card-badges">
                          <span className="course-card-code">{course.code}</span>
                          {course.isNew && <span className="course-card-new">YENİ</span>}
                        </div>
                        <span className={`course-card-level level-${course.level.toLowerCase()}`}>
                          {course.level}
                        </span>
                      </div>

                      <div className="course-card-body">
                        <span className="course-card-category">{course.category}</span>
                        <h3 className="course-card-title">{course.shortTitle}</h3>

                        <div className="course-card-meta">
                          <span className="course-card-meta-item">
                            <Briefcase size={14} />
                            {course.duration}
                          </span>
                        </div>

                        <div className="course-card-footer">
                          <span className="course-card-cta">
                            Detayları Gör
                            <ChevronRight size={16} />
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

          </div>
        </div>
      </div>
    </article>
  );
}
