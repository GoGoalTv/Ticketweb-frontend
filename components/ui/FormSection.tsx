interface FormSectionProps {
  title: string;
  description?: string;
  children: any;
}

function FormSection({ title, description, children }: FormSectionProps) {
  return (
    <section className="py-10 border-b border-white/10">
      <h2 className="text-base font-semibold tracking-wide text-white/60 mb-2">
        {title}
      </h2>
      {description && <p className="text-white/30 mb-6">{description}</p>}

      <div className="space-y-5">{children}</div>
    </section>
  );
}

export default FormSection;
