import { PageContainer } from "@/components/layout/page-container"
import { CreateSubjectForm } from "@/components/subjects/create-subject-form"

export default function NewMaterialPage() {
  return (
    <PageContainer>
      <div className="max-w-2xl mx-auto px-4">
        <CreateSubjectForm />
      </div>
    </PageContainer>
  )
} 