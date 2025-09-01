import { Component, OnInit ,AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http'; 
import { FormsModule } from '@angular/forms'; 

import { PortfolioApiService } from '../portfolio-api.services';
import { WebSocketService } from '../websocket.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule,HttpClientModule,FormsModule],
  providers: [PortfolioApiService,WebSocketService],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, AfterViewInit, OnDestroy  {
isLoading: boolean = true; 
  selectedRole: string = '';
  isMobileMenuOpen = false;
   navVisible = false;
   scrollProgress: number = 0;
  selectedTimelineItemIndex: number = 0;
  contactSuccessMessage: string = '';
  showSuccessAlert: boolean = false;
  //Integration from backend
  contactSubmitting = false;
  contactSubmitted = false;
  contactError: string | null = null;
 contactResponse: any = null;
private sessionStartTime = Date.now();
private currentPage = 'home';
liveStats: any = null;
  
  profile = {
    name: "Sweta Suman",
    title: "Senior Software Engineer & Cloud Architect",
    initials: "SS",
    tagline: "The Go-To Engineer for Cloud-Native and Full Stack Solutions",
    about: {
      heading: "Professional Summary",
      paragraph1: "I'm that developer who says 'nope' when something doesn't fit, asks for trendy tech because I actually keep up with the latest, and yes - I do throw in dad jokes during code reviews.",
      paragraph2: "From cloud wizardry at Infor to banking revamps at JP Morgan, enterprise builds at Infosys, consulting at Golden Sparrow, and product support at HCL — I’ve spent 10+ years turning complex problems into clean code"
    },
    philosophy: "Experienced in event-driven architecture and a recognized leader in Agile teams, having served as a Scrum Master and technical mentor. Known for a security-first approach and a track record of driving automation and continuous improvement.",
    traits: [
      { icon: '🎯', title: 'Decisive & Agile', description: 'Driving daily stand-ups, sprint planning, and retrospectives to ensure project alignment and team productivity.' },
      { icon: '🔥', title: 'Automation Expert', description: 'Automated full-stack CI/CD pipelines, cutting provisioning time by 60% and reducing deployment errors.' },
      { icon: '🔒', title: 'Security-Focused', description: 'Hardened applications with OAuth2, JWT, IAM policies, and applied OWASP security guidelines.' },
      { icon: '🚀', title: 'Results-Oriented', description: 'Produced detailed API documentation and partner integration guides, reducing support requests by 30%.' }
    ],
    funFacts: [
      { title: '🤓 Dad Joke Enthusiast', description: '"How do you comfort a JavaScript bug? Console it!" - Yeah, I said that in a serious meeting once.' },
      { title: '⚡ Quick Learner', description: 'Give me something trendy and I\'ll probably have a blog post about it by next week. Currently obsessing over Virtual Threads.' },
      { title: '🎯 No-Nonsense Approach', description: 'Life\'s too short for meetings that could have been emails and code that doesn\'t solve actual problems.' },
      { title: '🌍 Dutch Life', description: 'Living in Amersfoort, cycling to work (when not remote), and yes, I do speak a bit of Dutch now: "Geen probleem!"' },
      { icon: '🗺️', title: 'Domain-Hopping Veteran', description: 'From banking and ERP to telecom and insurance, my code has been battle-tested across a wide range of industries.' },
      { title: '🚀 Always Shipping', description: 'My code doesn\'t just work on my machine - it works in production, scales, and makes users happy. Novel concept, I know.' }
    ],
    contacts: [
      { icon: '📱', value: '+31 644 751 488' },
      { icon: '✉️', value: 'swetasuman295@gmail.com' },
      { icon: '📍', value: 'Amersfoort, Netherlands' },
      { icon: '💼', value: 'Available Immediately' }
    ]
  };
 passions = [
    { icon: '💪', title: 'Gym & Fitness', description: 'I believe a healthy body is key to a sharp mind. I spend my mornings in the gym to stay focused and disciplined.' },
    { icon: '⛸️', title: 'Skating', description: 'When I\'m not coding, you can find me on wheels. It’s my way to unwind, stay active, and explore the city.' },
    { icon: '🧑‍💻', title: 'Learning New Tech', description: 'I\'m always exploring new technologies and frameworks, which keeps my skills current and my passion for coding alive.' },
    { icon: '👩‍🍳', title: 'Cooking & Baking', description: 'Cooking is my creative outlet. I love experimenting with new recipes and sharing delicious meals with friends and family.' }
  ];

  roles = [
    { name: 'Backend Developer', role: 'backend', skills: ["Java 17+", "Spring Boot", "Virtual Threads", "Kafka", "REST APIs", "Microservices", "JPA/Hibernate","GIT" , "Jenkins"] },
    { name: 'Cloud Developer', role: 'cloud', skills: ["Azure (AZ-204)", "AWS", "Docker", "Kubernetes", "CI/CD", "Terraform"] },
    { name: 'Full Stack Engineer', role: 'fullstack', skills: ["Angular 17+", "TypeScript", "RxJS", "HTML5/CSS3", "Bootstrap", "Material Design"] },
    { name: 'Architecture Expert', role: 'architecture', skills: ["Domain Driven Design", "Event Sourcing", "CQRS", "System Design"] },
    { name: 'Certifications', role: 'certification', skills: ["Microsoft Certified Azure Developer", "AWS Certified Cloud Practitioner", "Infosys Certified Global Agile Developer"] }
  ];

  timeline = [
    {
      company: 'Why Hire Me 🤓 ',
      role: 'Software Developer',
      years: '??',
      achievements: [
       'You know, I have spent over a decade making sure Java code is bug-free and scalable. But if you are asking me for a good joke, I have got a whole new set of bugs for you. My portfolio is a testament to my skills, but my sense of humor? That is just a free feature.',
       '💡 I bring 10+ years of enterprise experience across Banking, ERP, Telecom, and Cloud platforms.',
       '🎯 I am already in Netherlands with immediate availability - no visa delays or relocation costs.'
      ]
    },
    {
      company: 'INFOR BV',
      role: 'Software Developer',
      years: 'Aug 2021-Present',
      achievements: [
        'Architected and implemented real-time WebSocket infrastructure for live ERP filters, enabling dynamic interactivity and low-latency updates in enterprise workflows.',
        'Designed and deployed stateless microservices using Java 17, Spring Boot, Hibernate, and REST APIs across AWS (EC2, EKS, RDS) and Azure App Services, ensuring scalability, high availability, and low failure rates.',
        'Automated full-stack CI/CD pipelines with GitHub Actions, Jenkins, Azure DevOps, and Terraform, cutting environment provisioning time by 60% and reducing deployment errors.',
        'Mentored junior developers, led cloud best practice sessions, conducted code reviews, and actively contributed to agile ceremonies, design sessions, and DevSecOps practices.',
      ]
    },
    {
      company: 'JP MORGAN CHASE & CO.',
      role: 'Full Stack Developer',
      years: 'Feb 2020-Aug 2021',
      achievements: [
        'Modernized the entitlements module of the core customer data portal using Java, Angular, and RESTful services.',
        'Engineered a dynamic, fine-grained role-based access management system by mapping user roles to resources and enforcing location- or policy-based access controls.',
        'Led a key DevOps initiative by automating SQL script deployment using Jenkins, significantly reducing manual effort, improving accuracy, and accelerating release cycles.',
        'Built secure deployment pipelines with automated testing, versioning, and rollback strategies-reducing release cycle times by 40%.',
      ]
    },
    {
      company: 'INFOSYS',
      role: 'Senior System Engineer',
      years: 'Jan 2017-Dec 2020',
      achievements: [
        'Collaborated with clients onsite in Switzerland and Amsterdam, providing hands-on technical consulting and software solutions.',
        'Served as a DevOps Engineer for a major Telecom provider in the Netherlands, ensuring optimal web flow performance, deploying new application versions, and resolving production issues efficiently.',
        'Implemented Quartz Scheduler with Cron-based middleware in a J2EE environment, supported by a Hibernate-based backend.',
        'Designed and enhanced backend services to meet evolving customer requirements, ensuring smooth data capture and retrieval through form-based workflows.',
      ]
    },
  ];


  
  selectedRoleSkills: string[] = [];
  constructor(
    //Integration from backend
    private portfolioApi: PortfolioApiService, 
    private webSocketService: WebSocketService 
  ) {}
  ngOnInit(): void {
    setTimeout(() => {
      this.isLoading = false;
      this.trackVisitorSession();
      this.checkBackendHealth();
      // 👇 5. CONNECT and SUBSCRIBE to WebSocket updates
      this.webSocketService.connect();
      this.webSocketService.liveStats$.subscribe(stats => {
        if (stats) {
          this.liveStats = stats;
          // Optional: Show a notification for new visitors
          this.showRealtimeNotification(`Active viewers: ${stats.activeViewers}`);
        }
      });
    }, 1500);
  }
   ngAfterViewInit(): void {
    this.setupScrollListeners();
    this.setupIntersectionObservers();
  }

  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.onScroll);
    this.webSocketService.disconnect();
  } 



  selectRole(role: string): void {
    this.selectedRole = role;
    const selectedRoleData = this.roles.find(r => r.role === role);
    if (selectedRoleData) {
      this.selectedRoleSkills = selectedRoleData.skills;
    }
  }
goToTimelineItem(index: number) {
  this.selectedTimelineItemIndex = index;
   // Scroll to the timeline details section instead of the specific item
  setTimeout(() => {
    const timelineSection = document.querySelector('.timeline-details');
    if (timelineSection) {
      timelineSection.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' // This keeps it more centered instead of at the top
      });
    }
  }, 0);
}


  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }

 /**
   * Scroll to section with tracking
   */
  scrollToSection(sectionId: string): void {
  const timeSpent = Math.floor((Date.now() - this.sessionStartTime) / 1000);
  
  // Track page view
  this.portfolioApi.trackPageView(sectionId, this.currentPage, timeSpent).subscribe({
    next: () => {},
    error: () => {} // Fail silently
  });
  
  this.currentPage = sectionId;
  this.sessionStartTime = Date.now();
  
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
  this.closeMobileMenu();
}
  

onContactFormSubmit(formData: any) {
  this.contactSubmitting = true;
  this.contactError = null;
  this.showSuccessAlert = false;
  
  this.portfolioApi.submitContact(formData).subscribe({
    next: (response) => {
      this.contactSubmitting = false;
      this.contactSubmitted = true;
      
      // Store the full response for enhanced display
      this.contactResponse = response;
      this.contactSuccessMessage = response.message;
      this.showSuccessAlert = true;
      
      // Clear form
      this.contactMessage = '';
      
      // Hide success message after 60 seconds
      setTimeout(() => {
        this.showSuccessAlert = false;
        this.contactSubmitted = false;
        this.contactResponse = null;
      }, 60000);
    },
    error: (error) => {
      this.contactSubmitting = false;
      
      if (error.status === 400 && error.error) {
        const errors = typeof error.error === 'object' 
          ? Object.values(error.error).join(', ')
          : error.error;
        this.contactError = errors || 'Invalid input';
      } else {
        this.contactError = 'Failed to send message. Please try again.';
      }
    }
  });
}


  /**
   * Check if backend is running
   */
  private checkBackendHealth(): void {
    this.portfolioApi.checkHealth().subscribe({
      next: (response) => {
        console.log('✅ Backend is healthy:', response);
      },
      error: (error) => {
        console.warn('⚠️ Backend might be offline:', error);
        // Still allow the portfolio to work without backend
      }
    });
  }
  
 
  private showRealtimeNotification(message: string): void {
    // Create a visual notification
    const notification = document.createElement('div');
    notification.className = 'realtime-notification';
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 80px;
      right: 20px;
      padding: 15px;
      background: #667eea;
      color: white;
      border-radius: 8px;
      z-index: 1000;
      animation: slideIn 0.3s ease;
      max-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 5000);
  }


private setupScrollListeners(): void {
    window.addEventListener('scroll', this.onScroll.bind(this));
  }
 private onScroll(): void {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;

    this.scrollProgress = (scrollTop / windowHeight) * 100;

    this.navVisible = scrollTop > 100;
  }
private setupIntersectionObservers(): void {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');

          if (entry.target.classList.contains('skill-category')) {
            const skillBars = entry.target.querySelectorAll('.skill-progress') as NodeListOf<HTMLElement>;
            skillBars.forEach(bar => {
              const width = bar.getAttribute('data-width');
              if (width) {
                setTimeout(() => {
                  bar.style.width = width + '%';
                }, 300);
              }
            });
          }
        }
      });
    }, observerOptions);

    setTimeout(() => {
      const elementsToObserve = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .skill-category');
      elementsToObserve.forEach(el => observer.observe(el));
    }, 100);
  }

  
contactMessage: string = '';
aiSuggestions: string[] = [];


generateAIMessage(): void {
    this.aiSuggestions = [
        "I need a backend architect for microservices migration",
        "Looking for Azure cloud expertise for enterprise scaling", 
        "Seeking full-stack developer for fintech application",
        "Need Java Spring Boot expert for banking modernization",
        "Require DevOps engineer for CI/CD automation",
        "Looking for Kafka and event-driven architecture specialist"
    ];
}

applySuggestion(suggestion: string): void {
    if (this.contactMessage.trim()) {
        this.contactMessage += '. ' + suggestion;
    } else {
        this.contactMessage = suggestion;
    }
    this.aiSuggestions = [];
}
private trackVisitorSession(): void {
  this.portfolioApi.trackVisitorSession().subscribe({
    next: () => console.log('Session tracked'),
    error: () => {} // Fail silently if backend is offline
  });
}
}