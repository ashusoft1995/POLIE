"use client";
import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Car, Save } from "lucide-react";
import Modal from "@/components/ui/modal";
import FormField from "@/components/ui/FormField";
import ToastContainer, { ToastMessage } from "@/components/ui/toast";
import { validators } from "@/lib/validation";

type Vehicle = { id:string; plate:string; make:string; model:string; year:string; color:string; vin:string; ownerName:string; ownerId:string; ownerPhone:string; ownerEmail:string; ownerAddress:string; registered:string; };
const emptyV: Omit<Vehicle,"id"|"registered"> = { plate:"",make:"",model:"",year:"",color:"",vin:"",ownerName:"",ownerId:"",ownerPhone:"",ownerEmail:"",ownerAddress:"" };
type Errors = Partial<Record<keyof typeof emptyV, string>>;

const mockVehicles: Vehicle[] = [
  { id:"VH001", plate:"AA-12345", make:"Toyota", model:"Corolla", year:"2019", color:"White", vin:"JT2BF12K1X0247148", ownerName:"Kebede Alemu", ownerId:"ET001234", ownerPhone:"0911223344", ownerEmail:"", ownerAddress:"Kebele 02", registered:"2024-10-01" },
  { id:"VH002", plate:"AA-67890", make:"Isuzu",  model:"Truck",   year:"2015", color:"Blue",  vin:"JALE5B16200012345", ownerName:"Meron Tadesse", ownerId:"ET005678", ownerPhone:"0922334455", ownerEmail:"", ownerAddress:"Market Area", registered:"2024-10-15" },
];

function validate(f: typeof emptyV): Errors {
  const e: Errors = {};
  if (!f.plate.trim())       e.plate       = "Plate number is required.";
  if (!f.make.trim())        e.make        = "Vehicle make is required.";
  if (!f.model.trim())       e.model       = "Model is required.";
  if (!f.year || isNaN(parseInt(f.year)) || parseInt(f.year) < 1980 || parseInt(f.year) > 2026)
                             e.year        = "Enter a valid year (1980–2026).";
  if (!f.color.trim())       e.color       = "Color is required.";
  const name = validators.name(f.ownerName); if (name) e.ownerName = name;
  if (!f.ownerId || f.ownerId.trim().length < 5) e.ownerId = "ID must be at least 5 characters.";
  const phone = validators.phone(f.ownerPhone); if (phone) e.ownerPhone = phone;
  if (f.ownerEmail) { const em = validators.email(f.ownerEmail); if (em) e.ownerEmail = em; }
  if (!f.ownerAddress.trim()) e.ownerAddress = "Address is required.";
  return e;
}

export default function TrafficRegisterPage() {
  const [list, setList]           = useState<Vehicle[]>(mockVehicles);
  const [open, setOpen]           = useState(false);
  const [form, setForm]           = useState({ ...emptyV });
  const [errors, setErrors]       = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [toasts, setToasts]       = useState<ToastMessage[]>([]);

  const addToast = useCallback((type: ToastMessage["type"], message: string) =>
    setToasts(t => [...t, { id:`${Date.now()}-${Math.random()}`, type, message }]), []);
  const removeToast = useCallback((id: string) =>
    setToasts(t => t.filter(x => x.id !== id)), []);

  function set(field: keyof typeof emptyV, value: string) {
    setForm(f => ({ ...f, [field]: value }));
    if (errors[field]) setErrors(e => { const c={...e}; delete c[field]; return c; });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length) { setErrors(errs); addToast("error","Please fix the highlighted fields."); return; }
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 900));
    const v: Vehicle = { ...form, id:`VH${String(list.length+1).padStart(3,"0")}`, registered: new Date().toISOString().split("T")[0] };
    setList(l => [v, ...l]);
    setSubmitting(false);
    setOpen(false);
    setForm({ ...emptyV });
    addToast("success", `Vehicle ${form.plate} registered successfully.`);
  }

  return (
    <>
      <div className="space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="text-xl font-bold text-[var(--navy)]">Vehicle Registry</h2>
            <p className="text-sm text-[var(--slate)] mt-0.5">Register and manage vehicles in the traffic database.</p>
          </div>
          <motion.button whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }} onClick={() => { setForm({...emptyV}); setErrors({}); setOpen(true); }} className="btn-primary">
            <Car size={15}/> Register Vehicle
          </motion.button>
        </div>

        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[var(--surface2)] border-b border-[var(--border)]">
                  {["Plate","Make / Model","Year","Color","Owner","Phone","Registered"].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-bold text-[var(--slate)] uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {list.map(v => (
                  <tr key={v.id} className="hover:bg-[var(--surface2)] transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-[var(--green)]">{v.plate}</td>
                    <td className="px-4 py-3"><p className="font-semibold text-[var(--navy)]">{v.make}</p><p className="text-xs text-[var(--slate)]">{v.model}</p></td>
                    <td className="px-4 py-3 text-[var(--charcoal)]">{v.year}</td>
                    <td className="px-4 py-3 text-[var(--charcoal)]">{v.color}</td>
                    <td className="px-4 py-3 font-medium text-[var(--navy)]">{v.ownerName}</td>
                    <td className="px-4 py-3 text-[var(--slate)]">{v.ownerPhone}</td>
                    <td className="px-4 py-3 text-[var(--slate)]">{v.registered}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Modal isOpen={open} onClose={() => setOpen(false)} title="Register New Vehicle" size="sm" accent="blue">
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <p className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest border-b border-[var(--border)] pb-1">Vehicle Information</p>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Plate Number" required id="vPlate" type="text" placeholder="AA-12345"
              value={form.plate} onChange={e => set("plate",(e.target as HTMLInputElement).value)} error={errors.plate}/>
            <FormField label="Make" required id="vMake" type="text" placeholder="Toyota"
              value={form.make} onChange={e => set("make",(e.target as HTMLInputElement).value)} error={errors.make}/>
            <FormField label="Model" required id="vModel" type="text" placeholder="Corolla"
              value={form.model} onChange={e => set("model",(e.target as HTMLInputElement).value)} error={errors.model}/>
            <FormField label="Year" required id="vYear" type="number" placeholder="2020"
              value={form.year} onChange={e => set("year",(e.target as HTMLInputElement).value)} error={errors.year}/>
            <FormField label="Color" required id="vColor" type="text" placeholder="White"
              value={form.color} onChange={e => set("color",(e.target as HTMLInputElement).value)} error={errors.color}/>
            <FormField label="VIN (optional)" id="vVin" type="text" placeholder="17-char VIN"
              value={form.vin} onChange={e => set("vin",(e.target as HTMLInputElement).value)}/>
          </div>

          <p className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest border-b border-[var(--border)] pb-1 pt-1">Owner Details</p>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Owner Name" required id="vOwner" type="text" placeholder="Min 4 letters"
              value={form.ownerName} onChange={e => set("ownerName",(e.target as HTMLInputElement).value)} error={errors.ownerName} className="col-span-2"/>
            <FormField label="National ID" required id="vOwnId" type="text" placeholder="Min 5 chars"
              value={form.ownerId} onChange={e => set("ownerId",(e.target as HTMLInputElement).value)} error={errors.ownerId}/>
            <FormField label="Phone" required id="vPhone" type="tel" placeholder="09XXXXXXXX"
              value={form.ownerPhone} onChange={e => set("ownerPhone",(e.target as HTMLInputElement).value)} error={errors.ownerPhone} hint="09... or 07..."/>
            <FormField label="Email (optional)" id="vEmail" type="email"
              value={form.ownerEmail} onChange={e => set("ownerEmail",(e.target as HTMLInputElement).value)} error={errors.ownerEmail}/>
            <FormField label="Address" required id="vAddr" type="text"
              value={form.ownerAddress} onChange={e => set("ownerAddress",(e.target as HTMLInputElement).value)} error={errors.ownerAddress}/>
          </div>

          <div className="flex gap-2 pt-2 border-t border-[var(--border)]">
            <button type="button" onClick={() => setOpen(false)}
              className="flex-1 px-4 py-2 rounded-xl border border-[var(--border)] text-sm font-medium text-[var(--slate)] hover:bg-[var(--surface2)] transition-colors">Cancel</button>
            <button type="submit" disabled={submitting} className="flex-1 btn-primary">
              {submitting ? <span className="flex items-center gap-2"><svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>Saving…</span>
              : <><Car size={14}/> Register</>}
            </button>
          </div>
        </form>
      </Modal>
      <ToastContainer toasts={toasts} onRemove={removeToast}/>
    </>
  );
}
