<template>
  <div class="space-y-8 max-w-4xl mx-auto">
    <!-- Header -->
    <div class="space-y-4">
      <h1 class="text-4xl font-bold tracking-tight">Sarah Anderson</h1>
      <div class="flex items-center gap-4 text-muted-foreground">
        <div class="flex items-center gap-2">
          <Mail class="h-4 w-4" />
          <span>sarah.anderson@email.com</span>
        </div>
        <div class="flex items-center gap-2">
          <Phone class="h-4 w-4" />
          <span>+46 70 123 45 67</span>
        </div>
        <div class="flex items-center gap-2">
          <MapPin class="h-4 w-4" />
          <span>Stockholm, Sweden</span>
        </div>
      </div>
      <p class="text-lg text-muted-foreground">
        HR student with a passion for organizational development and employee well-being. 
        Seeking opportunities to apply theoretical knowledge in a practical setting while contributing 
        to creating positive workplace cultures.
      </p>
    </div>

    <!-- Education -->
    <Card>
      <CardHeader>
        <CardTitle class="flex items-center gap-2">
          <GraduationCap class="h-5 w-5" />
          Education
        </CardTitle>
      </CardHeader>
      <CardContent class="space-y-6">
        <div class="space-y-2">
          <div class="flex justify-between items-start">
            <div>
              <h3 class="font-semibold">Bachelor in Human Resource Management</h3>
              <p class="text-muted-foreground">Stockholm University</p>
            </div>
            <Badge>2021 - Present</Badge>
          </div>
          <p class="text-sm text-muted-foreground">
            Specializing in organizational psychology and talent management. 
            Current GPA: 3.8/4.0
          </p>
          <ul class="text-sm text-muted-foreground list-disc pl-4 space-y-1">
            <li>Student Representative, HR Student Association</li>
            <li>Thesis: "Remote Work's Impact on Employee Engagement"</li>
            <li>Relevant courses: Organizational Behavior, Employment Law, Talent Acquisition</li>
          </ul>
        </div>
      </CardContent>
    </Card>

    <!-- Experience -->
    <Card>
      <CardHeader>
        <CardTitle class="flex items-center gap-2">
          <Briefcase class="h-5 w-5" />
          Experience
        </CardTitle>
      </CardHeader>
      <CardContent class="space-y-6">
        <div class="space-y-2">
          <div class="flex justify-between items-start">
            <div>
              <h3 class="font-semibold">HR Intern</h3>
              <p class="text-muted-foreground">TechStart AB</p>
            </div>
            <Badge>Summer 2023</Badge>
          </div>
          <ul class="text-sm text-muted-foreground list-disc pl-4 space-y-1">
            <li>Assisted in recruitment processes for 10+ positions</li>
            <li>Developed onboarding materials for new employees</li>
            <li>Conducted research on employee engagement best practices</li>
            <li>Supported the HR team with administrative tasks</li>
          </ul>
        </div>

        <div class="space-y-2">
          <div class="flex justify-between items-start">
            <div>
              <h3 class="font-semibold">Student Ambassador</h3>
              <p class="text-muted-foreground">Stockholm University</p>
            </div>
            <Badge>2022 - Present</Badge>
          </div>
          <ul class="text-sm text-muted-foreground list-disc pl-4 space-y-1">
            <li>Represent the university at career fairs and student events</li>
            <li>Guide prospective students through the application process</li>
            <li>Organize and lead campus tours for international students</li>
          </ul>
        </div>
      </CardContent>
    </Card>

    <!-- Skills -->
    <Card>
      <CardHeader>
        <CardTitle class="flex items-center gap-2">
          <Wrench class="h-5 w-5" />
          Skills
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Professional Skills -->
          <div class="space-y-4">
            <h3 class="font-semibold">Professional Skills</h3>
            <div class="space-y-2">
              <div v-for="skill in professionalSkills" :key="skill.name" class="space-y-1">
                <div class="flex justify-between text-sm">
                  <span>{{ skill.name }}</span>
                  <span class="text-muted-foreground">{{ skill.level }}</span>
                </div>
                <Progress :value="skill.value" />
              </div>
            </div>
          </div>

          <!-- Technical Skills -->
          <div class="space-y-4">
            <h3 class="font-semibold">Technical Skills</h3>
            <div class="flex flex-wrap gap-2">
              <Badge variant="secondary" v-for="skill in technicalSkills" :key="skill">
                {{ skill }}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Languages -->
    <Card>
      <CardHeader>
        <CardTitle class="flex items-center gap-2">
          <Languages class="h-5 w-5" />
          Languages
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div v-for="language in languages" :key="language.name" class="space-y-1">
            <div class="flex justify-between text-sm">
              <span>{{ language.name }}</span>
              <span class="text-muted-foreground">{{ language.level }}</span>
            </div>
            <Progress :value="language.value" />
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Certifications -->
    <Card>
      <CardHeader>
        <CardTitle class="flex items-center gap-2">
          <Award class="h-5 w-5" />
          Certifications & Achievements
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul class="space-y-2">
          <li v-for="cert in certifications" :key="cert.name" class="flex items-start gap-4">
            <Badge variant="outline" class="mt-0.5">{{ cert.year }}</Badge>
            <div>
              <p class="font-medium">{{ cert.name }}</p>
              <p class="text-sm text-muted-foreground">{{ cert.issuer }}</p>
            </div>
          </li>
        </ul>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { 
  Mail, 
  Phone, 
  MapPin, 
  GraduationCap, 
  Briefcase, 
  Wrench,
  Languages,
  Award
} from 'lucide-vue-next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth', 'admin'],
  breadcrumb: 'Resume'
})

const professionalSkills = [
  { name: 'Recruitment & Selection', level: 'Advanced', value: 85 },
  { name: 'Employee Relations', level: 'Intermediate', value: 75 },
  { name: 'Performance Management', level: 'Intermediate', value: 70 },
  { name: 'Training & Development', level: 'Advanced', value: 80 }
]

const technicalSkills = [
  'Microsoft Office Suite',
  'ATS Systems',
  'Workday',
  'SAP SuccessFactors',
  'LinkedIn Recruiter',
  'HRIS',
  'Google Workspace',
  'Asana'
]

const languages = [
  { name: 'Swedish', level: 'Native', value: 100 },
  { name: 'English', level: 'Fluent', value: 95 },
  { name: 'German', level: 'Intermediate', value: 60 },
  { name: 'Spanish', level: 'Basic', value: 30 }
]

const certifications = [
  {
    year: '2023',
    name: 'SHRM Certified Professional (SHRM-CP)',
    issuer: 'Society for Human Resource Management'
  },
  {
    year: '2023',
    name: 'Talent Acquisition Certification',
    issuer: 'HR Certification Institute'
  },
  {
    year: '2022',
    name: 'Digital HR Transformation',
    issuer: 'LinkedIn Learning'
  }
]
</script> 