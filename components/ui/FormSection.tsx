
interface FormSectionProps{
    title: string;
    children: any;
}

function FormSection({ title, children }: FormSectionProps) {
  return (
    <section className="py-10 border-b border-white/10">
      <h2 className="text-base font-semibold tracking-wide text-white/60 mb-6">
        {title}
      </h2>

      <div className="space-y-5">
        {children}
      </div>
    </section>
  );
}

export default FormSection