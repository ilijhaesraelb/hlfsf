import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  submitCorporateInquiry,
  requestPrivateMeeting,
} from "@/lib/corporate.functions";
import {
  ACCEPTED_UPLOAD,
  COMPANY_TYPES,
  CONTACT_METHODS,
  CONTRIBUTION_RANGES,
  CONTRIBUTION_TYPES,
  DISCLAIMERS,
  MAX_UPLOAD_MB,
  OBJECTIVES,
  PARTNERSHIP_TYPES,
  VEHICLE_TYPES,
} from "@/data/partnerships";

const field =
  "w-full border border-border bg-[#050505] px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-silver/60 focus:border-gold";
const label =
  "block text-[0.58rem] uppercase tracking-[0.24em] text-silver";

function Field({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className={label}>
        {title}
      </label>
      {children}
    </div>
  );
}

function CheckGrid({
  name,
  options,
  selected,
  onToggle,
}: {
  name: string;
  options: readonly string[];
  selected: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
      {options.map((opt) => {
        const id = `${name}-${opt.replace(/\W+/g, "-").toLowerCase()}`;
        const active = selected.includes(opt);
        return (
          <label
            key={opt}
            htmlFor={id}
            className={`flex cursor-pointer items-start gap-3 border px-4 py-3 text-xs transition-colors ${
              active
                ? "border-gold/70 bg-gold/10 text-foreground"
                : "border-border bg-[#050505] text-silver hover:border-gold/40"
            }`}
          >
            <input
              id={id}
              type="checkbox"
              checked={active}
              onChange={() => onToggle(opt)}
              className="mt-0.5 h-4 w-4 accent-[var(--gold)]"
            />
            <span>{opt}</span>
          </label>
        );
      })}
    </div>
  );
}

const STEPS = [
  "Organization",
  "Partnership Interest",
  "Details",
  "Contribution",
  "Confidentiality",
];

type Docs = { name: string; type: string; data: string; size: number }[];

function readFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result);
      resolve(result.slice(result.indexOf(",") + 1));
    };
    reader.onerror = () => reject(new Error("Could not read file"));
    reader.readAsDataURL(file);
  });
}

export function CorporateInquiryForm() {
  const submit = useServerFn(submitCorporateInquiry);

  const [step, setStep] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);

  const [form, setForm] = useState({
    organization: "",
    contactPerson: "",
    jobTitle: "",
    country: "",
    email: "",
    telephone: "",
    website: "",
    companyType: "",
    contributionRange: "",
    objectivesNote: "",
    preferredContact: "",
    companyFax: "",
  });
  const [partnershipTypes, setPartnershipTypes] = useState<string[]>([]);
  const [contributionTypes, setContributionTypes] = useState<string[]>([]);
  const [objectives, setObjectives] = useState<string[]>([]);
  const [automotive, setAutomotive] = useState({
    vehicleType: "",
    quantity: "",
    modelYear: "",
    contributionForm: "",
    availability: "",
    notes: "",
  });
  const [property, setProperty] = useState({
    propertyType: "",
    location: "",
    size: "",
    condition: "",
    availability: "",
    notes: "",
  });
  const [technology, setTechnology] = useState({
    category: "",
    description: "",
  });
  const [confidential, setConfidential] = useState(false);
  const [ndaRequested, setNdaRequested] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const [docs, setDocs] = useState<Docs>([]);

  const set = (key: keyof typeof form) => (value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const toggle =
    (setter: React.Dispatch<React.SetStateAction<string[]>>) =>
    (value: string) =>
      setter((prev) =>
        prev.includes(value)
          ? prev.filter((v) => v !== value)
          : [...prev, value],
      );

  const wantsAutomotive = partnershipTypes.some((t) =>
    /vehicle|automotive/i.test(t),
  );
  const wantsProperty = partnershipTypes.some((t) =>
    /building|property|land|construction/i.test(t),
  );
  const wantsTechnology = partnershipTypes.some((t) =>
    /technology|equipment/i.test(t),
  );
  const hasDetailStep = wantsAutomotive || wantsProperty || wantsTechnology;

  const stepValid = (() => {
    if (step === 0)
      return (
        form.organization.trim().length > 1 &&
        form.contactPerson.trim().length > 1 &&
        form.country.trim().length > 1 &&
        /.+@.+\..+/.test(form.email) &&
        form.companyType !== ""
      );
    if (step === 1) return partnershipTypes.length > 0;
    if (step === 4) return authorized;
    return true;
  })();

  function goNext() {
    setError(null);
    let next = step + 1;
    if (next === 2 && !hasDetailStep) next = 3;
    setStep(Math.min(next, STEPS.length - 1));
  }
  function goBack() {
    setError(null);
    let prev = step - 1;
    if (prev === 2 && !hasDetailStep) prev = 1;
    setStep(Math.max(prev, 0));
  }

  async function onFiles(files: FileList | null) {
    if (!files) return;
    setError(null);
    const next: Docs = [];
    for (const file of Array.from(files).slice(0, 5)) {
      if (file.size > MAX_UPLOAD_MB * 1024 * 1024) {
        setError(`${file.name} exceeds the ${MAX_UPLOAD_MB} MB limit.`);
        continue;
      }
      next.push({
        name: file.name,
        type: file.type,
        data: await readFile(file),
        size: file.size,
      });
    }
    setDocs((d) => [...d, ...next].slice(0, 5));
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!authorized || busy) return;
    setBusy(true);
    setError(null);
    try {
      const result = await submit({
        data: {
          ...form,
          partnershipTypes,
          contributionTypes,
          objectives,
          automotive: wantsAutomotive ? automotive : null,
          property: wantsProperty ? property : null,
          technology: wantsTechnology ? technology : null,
          confidential,
          ndaRequested,
          authorized: true as const,
          documents: docs.map((d) => ({
            name: d.name,
            type: d.type,
            data: d.data,
          })),
          locale: "en",
        },
      });
      setReference(result.reference);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "The inquiry could not be submitted.",
      );
    } finally {
      setBusy(false);
    }
  }

  if (reference) {
    return (
      <div
        className="grain relative overflow-hidden border border-gold/40 bg-graphite/50 p-10 text-center"
        role="status"
      >
        <div
          aria-hidden
          className="beam absolute left-1/2 top-0 h-full w-24 -translate-x-1/2 opacity-40"
        />
        <p className="relative text-[0.58rem] uppercase tracking-[0.28em] text-gold">
          Inquiry Received
        </p>
        <h3 className="display relative mt-6 text-xl text-foreground">
          Thank you for contacting High Light Source Film Studios.
        </h3>
        <p className="relative mt-6 text-sm leading-relaxed text-silver">
          Your inquiry has been received and will be directed to the
          appropriate business-development representative.
        </p>
        <p className="relative mt-8 text-xs uppercase tracking-[0.24em] text-gold">
          Reference {reference}
        </p>
        <p className="relative mx-auto mt-8 max-w-xl text-xs leading-relaxed text-silver">
          Please do not transmit additional confidential financial, property or
          proprietary information until a secure communication process has been
          established.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-10" noValidate>
      {/* Progress */}
      <ol className="grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-5">
        {STEPS.map((name, index) => (
          <li
            key={name}
            aria-current={index === step ? "step" : undefined}
            className={`bg-[#050505] px-4 py-4 text-[0.55rem] uppercase tracking-[0.2em] ${
              index === step
                ? "text-gold"
                : index < step
                  ? "text-foreground"
                  : "text-silver/60"
            }`}
          >
            <span className="block">0{index + 1}</span>
            <span className="mt-2 block">{name}</span>
          </li>
        ))}
      </ol>

      {/* Honeypot */}
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        value={form.companyFax}
        onChange={(e) => set("companyFax")(e.target.value)}
        className="pointer-events-none absolute h-0 w-0 opacity-0"
      />

      {step === 0 && (
        <div className="grid gap-6 sm:grid-cols-2">
          <Field id="organization" title="Organization name *">
            <input
              id="organization"
              className={field}
              value={form.organization}
              onChange={(e) => set("organization")(e.target.value)}
              required
            />
          </Field>
          <Field id="contactPerson" title="Contact person *">
            <input
              id="contactPerson"
              className={field}
              value={form.contactPerson}
              onChange={(e) => set("contactPerson")(e.target.value)}
              required
            />
          </Field>
          <Field id="jobTitle" title="Job title">
            <input
              id="jobTitle"
              className={field}
              value={form.jobTitle}
              onChange={(e) => set("jobTitle")(e.target.value)}
            />
          </Field>
          <Field id="country" title="Country *">
            <input
              id="country"
              className={field}
              value={form.country}
              onChange={(e) => set("country")(e.target.value)}
              required
            />
          </Field>
          <Field id="email" title="Business email *">
            <input
              id="email"
              type="email"
              className={field}
              value={form.email}
              onChange={(e) => set("email")(e.target.value)}
              required
            />
          </Field>
          <Field id="telephone" title="Telephone">
            <input
              id="telephone"
              className={field}
              value={form.telephone}
              onChange={(e) => set("telephone")(e.target.value)}
            />
          </Field>
          <Field id="website" title="Website">
            <input
              id="website"
              className={field}
              value={form.website}
              onChange={(e) => set("website")(e.target.value)}
            />
          </Field>
          <Field id="companyType" title="Company type *">
            <select
              id="companyType"
              className={field}
              value={form.companyType}
              onChange={(e) => set("companyType")(e.target.value)}
              required
            >
              <option value="">Select…</option>
              {COMPANY_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </Field>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-6">
          <p className="text-sm text-silver">
            Select every area of interest. Additional detail is requested only
            where relevant.
          </p>
          <CheckGrid
            name="partnership"
            options={PARTNERSHIP_TYPES}
            selected={partnershipTypes}
            onToggle={toggle(setPartnershipTypes)}
          />
        </div>
      )}

      {step === 2 && (
        <div className="space-y-12">
          {wantsAutomotive && (
            <fieldset className="space-y-6">
              <legend className="display text-sm text-gold">
                Automotive details
              </legend>
              <div className="grid gap-6 sm:grid-cols-2">
                <Field id="vehicleType" title="Vehicle type">
                  <select
                    id="vehicleType"
                    className={field}
                    value={automotive.vehicleType}
                    onChange={(e) =>
                      setAutomotive({
                        ...automotive,
                        vehicleType: e.target.value,
                      })
                    }
                  >
                    <option value="">Select…</option>
                    {VEHICLE_TYPES.map((v) => (
                      <option key={v} value={v}>
                        {v}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field id="quantity" title="Quantity">
                  <input
                    id="quantity"
                    className={field}
                    value={automotive.quantity}
                    onChange={(e) =>
                      setAutomotive({ ...automotive, quantity: e.target.value })
                    }
                  />
                </Field>
                <Field id="modelYear" title="Model / year">
                  <input
                    id="modelYear"
                    className={field}
                    value={automotive.modelYear}
                    onChange={(e) =>
                      setAutomotive({
                        ...automotive,
                        modelYear: e.target.value,
                      })
                    }
                  />
                </Field>
                <Field
                  id="contributionForm"
                  title="Donation, sponsorship, loan or lease"
                >
                  <input
                    id="contributionForm"
                    className={field}
                    value={automotive.contributionForm}
                    onChange={(e) =>
                      setAutomotive({
                        ...automotive,
                        contributionForm: e.target.value,
                      })
                    }
                  />
                </Field>
                <Field id="autoAvailability" title="Availability timeframe">
                  <input
                    id="autoAvailability"
                    className={field}
                    value={automotive.availability}
                    onChange={(e) =>
                      setAutomotive({
                        ...automotive,
                        availability: e.target.value,
                      })
                    }
                  />
                </Field>
                <Field id="autoNotes" title="Notes">
                  <input
                    id="autoNotes"
                    className={field}
                    value={automotive.notes}
                    onChange={(e) =>
                      setAutomotive({ ...automotive, notes: e.target.value })
                    }
                  />
                </Field>
              </div>
              <p className="text-xs leading-relaxed text-silver">
                {DISCLAIMERS.automotive}
              </p>
            </fieldset>
          )}

          {wantsProperty && (
            <fieldset className="space-y-6">
              <legend className="display text-sm text-gold">
                Property details
              </legend>
              <div className="grid gap-6 sm:grid-cols-2">
                <Field id="propertyType" title="Property type">
                  <input
                    id="propertyType"
                    className={field}
                    value={property.propertyType}
                    onChange={(e) =>
                      setProperty({ ...property, propertyType: e.target.value })
                    }
                  />
                </Field>
                <Field id="location" title="Location">
                  <input
                    id="location"
                    className={field}
                    value={property.location}
                    onChange={(e) =>
                      setProperty({ ...property, location: e.target.value })
                    }
                  />
                </Field>
                <Field id="size" title="Size (sq ft / acreage)">
                  <input
                    id="size"
                    className={field}
                    value={property.size}
                    onChange={(e) =>
                      setProperty({ ...property, size: e.target.value })
                    }
                  />
                </Field>
                <Field id="condition" title="Condition">
                  <input
                    id="condition"
                    className={field}
                    value={property.condition}
                    onChange={(e) =>
                      setProperty({ ...property, condition: e.target.value })
                    }
                  />
                </Field>
                <Field id="propAvailability" title="Availability">
                  <input
                    id="propAvailability"
                    className={field}
                    value={property.availability}
                    onChange={(e) =>
                      setProperty({ ...property, availability: e.target.value })
                    }
                  />
                </Field>
                <Field id="propNotes" title="Notes">
                  <input
                    id="propNotes"
                    className={field}
                    value={property.notes}
                    onChange={(e) =>
                      setProperty({ ...property, notes: e.target.value })
                    }
                  />
                </Field>
              </div>
              <p className="text-xs leading-relaxed text-silver">
                {DISCLAIMERS.property}
              </p>
            </fieldset>
          )}

          {wantsTechnology && (
            <fieldset className="space-y-6">
              <legend className="display text-sm text-gold">
                Technology or equipment details
              </legend>
              <div className="grid gap-6">
                <Field id="techCategory" title="Category">
                  <input
                    id="techCategory"
                    className={field}
                    value={technology.category}
                    onChange={(e) =>
                      setTechnology({ ...technology, category: e.target.value })
                    }
                  />
                </Field>
                <Field id="techDescription" title="Description">
                  <textarea
                    id="techDescription"
                    rows={4}
                    className={field}
                    value={technology.description}
                    onChange={(e) =>
                      setTechnology({
                        ...technology,
                        description: e.target.value,
                      })
                    }
                  />
                </Field>
              </div>
            </fieldset>
          )}
        </div>
      )}

      {step === 3 && (
        <div className="space-y-10">
          <div className="space-y-4">
            <p className={label}>Type of contribution</p>
            <CheckGrid
              name="contribution"
              options={CONTRIBUTION_TYPES}
              selected={contributionTypes}
              onToggle={toggle(setContributionTypes)}
            />
          </div>
          <Field id="contributionRange" title="Estimated contribution range">
            <select
              id="contributionRange"
              className={field}
              value={form.contributionRange}
              onChange={(e) => set("contributionRange")(e.target.value)}
            >
              <option value="">Select…</option>
              {CONTRIBUTION_RANGES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </Field>
          <div className="space-y-4">
            <p className={label}>Partnership objectives</p>
            <CheckGrid
              name="objectives"
              options={OBJECTIVES}
              selected={objectives}
              onToggle={toggle(setObjectives)}
            />
          </div>
          <Field id="objectivesNote" title="Additional context">
            <textarea
              id="objectivesNote"
              rows={5}
              className={field}
              value={form.objectivesNote}
              onChange={(e) => set("objectivesNote")(e.target.value)}
            />
          </Field>
        </div>
      )}

      {step === 4 && (
        <div className="space-y-8">
          <Field id="preferredContact" title="Preferred contact method">
            <select
              id="preferredContact"
              className={field}
              value={form.preferredContact}
              onChange={(e) => set("preferredContact")(e.target.value)}
            >
              <option value="">Select…</option>
              {CONTACT_METHODS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </Field>

          <div className="space-y-3">
            <label htmlFor="documents" className={label}>
              Secure document upload (optional)
            </label>
            <input
              id="documents"
              type="file"
              multiple
              accept={ACCEPTED_UPLOAD}
              onChange={(e) => void onFiles(e.target.files)}
              className="block w-full text-xs text-silver file:mr-4 file:border file:border-gold/50 file:bg-transparent file:px-4 file:py-2 file:text-[0.6rem] file:uppercase file:tracking-[0.2em] file:text-gold"
            />
            <p className="text-xs text-silver">
              PDF, DOCX, XLSX, JPG or PNG. Up to 5 files, {MAX_UPLOAD_MB} MB
              each. Documents are stored privately and are not published.
            </p>
            {docs.length > 0 && (
              <ul className="space-y-2">
                {docs.map((d) => (
                  <li
                    key={d.name}
                    className="flex items-center justify-between border border-border px-4 py-2 text-xs text-silver"
                  >
                    <span>{d.name}</span>
                    <button
                      type="button"
                      onClick={() =>
                        setDocs((list) => list.filter((x) => x.name !== d.name))
                      }
                      className="uppercase tracking-[0.2em] text-gold"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="space-y-4">
            {[
              {
                id: "confidential",
                checked: confidential,
                set: setConfidential,
                text: "This inquiry is confidential.",
              },
              {
                id: "nda",
                checked: ndaRequested,
                set: setNdaRequested,
                text: "Request a mutual confidentiality agreement (NDA) before detailed discussions.",
              },
              {
                id: "authorized",
                checked: authorized,
                set: setAuthorized,
                text: "I confirm I am authorized to submit this inquiry on behalf of my organization. *",
              },
            ].map((box) => (
              <label
                key={box.id}
                htmlFor={box.id}
                className="flex cursor-pointer items-start gap-3 text-xs leading-relaxed text-silver"
              >
                <input
                  id={box.id}
                  type="checkbox"
                  checked={box.checked}
                  onChange={(e) => box.set(e.target.checked)}
                  className="mt-0.5 h-4 w-4 accent-[var(--gold)]"
                />
                <span>{box.text}</span>
              </label>
            ))}
          </div>

          <p className="border-l border-gold/40 pl-5 text-xs leading-relaxed text-silver">
            {DISCLAIMERS.placement}
          </p>
        </div>
      )}

      {error && (
        <p role="alert" className="text-xs text-destructive">
          {error}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-4 border-t border-border pt-8">
        {step > 0 && (
          <button
            type="button"
            onClick={goBack}
            className="min-h-11 border border-border px-6 py-3 text-[0.62rem] uppercase tracking-[0.24em] text-silver transition-colors hover:border-gold/50 hover:text-gold"
          >
            Back
          </button>
        )}
        {step < STEPS.length - 1 ? (
          <button
            type="button"
            onClick={goNext}
            disabled={!stepValid}
            className="min-h-11 border border-gold bg-gold px-8 py-3 text-[0.62rem] uppercase tracking-[0.24em] text-primary-foreground transition-colors hover:bg-gold-bright disabled:cursor-not-allowed disabled:opacity-40"
          >
            Continue
          </button>
        ) : (
          <button
            type="submit"
            disabled={!authorized || busy}
            className="min-h-11 border border-gold bg-gold px-8 py-3 text-[0.62rem] uppercase tracking-[0.24em] text-primary-foreground transition-colors hover:bg-gold-bright disabled:cursor-not-allowed disabled:opacity-40"
          >
            {busy ? "Submitting…" : "Submit Confidential Inquiry"}
          </button>
        )}
      </div>
    </form>
  );
}

export function PrivateMeetingForm() {
  const request = useServerFn(requestPrivateMeeting);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [state, setState] = useState({
    name: "",
    organization: "",
    email: "",
    country: "",
    reason: "",
    preferredDates: "",
    preferredFormat: "",
    companyFax: "",
  });

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      const result = await request({ data: { ...state, locale: "en" } });
      setDone(result.reference);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "The request could not be sent.",
      );
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <p role="status" className="text-sm leading-relaxed text-silver">
        Your meeting request has been received under reference{" "}
        <span className="text-gold">{done}</span>. A studio representative will
        respond directly.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-6 sm:grid-cols-2">
      <input
        type="text"
        tabIndex={-1}
        aria-hidden
        autoComplete="off"
        value={state.companyFax}
        onChange={(e) => setState({ ...state, companyFax: e.target.value })}
        className="pointer-events-none absolute h-0 w-0 opacity-0"
      />
      <Field id="pm-name" title="Name *">
        <input
          id="pm-name"
          className={field}
          value={state.name}
          onChange={(e) => setState({ ...state, name: e.target.value })}
          required
        />
      </Field>
      <Field id="pm-org" title="Organization *">
        <input
          id="pm-org"
          className={field}
          value={state.organization}
          onChange={(e) => setState({ ...state, organization: e.target.value })}
          required
        />
      </Field>
      <Field id="pm-email" title="Business email *">
        <input
          id="pm-email"
          type="email"
          className={field}
          value={state.email}
          onChange={(e) => setState({ ...state, email: e.target.value })}
          required
        />
      </Field>
      <Field id="pm-country" title="Country *">
        <input
          id="pm-country"
          className={field}
          value={state.country}
          onChange={(e) => setState({ ...state, country: e.target.value })}
          required
        />
      </Field>
      <Field id="pm-dates" title="Preferred dates">
        <input
          id="pm-dates"
          className={field}
          value={state.preferredDates}
          onChange={(e) =>
            setState({ ...state, preferredDates: e.target.value })
          }
        />
      </Field>
      <Field id="pm-format" title="Preferred format">
        <select
          id="pm-format"
          className={field}
          value={state.preferredFormat}
          onChange={(e) =>
            setState({ ...state, preferredFormat: e.target.value })
          }
        >
          <option value="">Select…</option>
          {CONTACT_METHODS.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </Field>
      <div className="sm:col-span-2">
        <Field id="pm-reason" title="Reason for the meeting *">
          <textarea
            id="pm-reason"
            rows={4}
            className={field}
            value={state.reason}
            onChange={(e) => setState({ ...state, reason: e.target.value })}
            required
          />
        </Field>
      </div>
      {error && (
        <p role="alert" className="text-xs text-destructive sm:col-span-2">
          {error}
        </p>
      )}
      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={busy}
          className="min-h-11 border border-gold/50 px-8 py-3 text-[0.62rem] uppercase tracking-[0.24em] text-gold transition-colors hover:bg-gold/10 disabled:opacity-40"
        >
          {busy ? "Sending…" : "Request Private Meeting"}
        </button>
      </div>
    </form>
  );
}
