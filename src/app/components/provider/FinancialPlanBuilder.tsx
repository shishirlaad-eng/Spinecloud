import { useState, useEffect } from "react";
import { ArrowLeft, Save, Printer, CreditCard, Building, Banknote } from "lucide-react";

export interface FinancialPlan {
  id: string;
  patientId: string;
  datePrepared: string;
  startDate: string;
  endDate: string;
  totalInvestment: number;
  
  // Payment Mode
  selectedPaymentMode: 'one-time' | 'monthly' | 'financing';
  
  // One Time Payment
  discountPercentage: number;
  
  // Monthly Payment
  monthlyMonths: number;
  autoChargeMethod: 'credit_card' | 'bank_debit' | '';
  ccType: string;
  ccNumberLast4: string;
  bankName: string;
  routingNumber: string;
  accountNumberLast4: string;
  
  // Financing
  financingMonths: number;

  patientSignatureDate: string;
  staffSignatureDate: string;
}

interface FinancialPlanBuilderProps {
  patientId: string;
  patientName: string;
  existingPlanId?: string | null;
  onSave: (plan: FinancialPlan) => void;
  onCancel: () => void;
}

export const FinancialPlanBuilder = ({ patientId, patientName, existingPlanId, onSave, onCancel }: FinancialPlanBuilderProps) => {
  const [plan, setPlan] = useState<FinancialPlan>({
    id: `fin-${Date.now()}`,
    patientId,
    datePrepared: new Date().toISOString(),
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 3 months later
    totalInvestment: 2370.00,
    selectedPaymentMode: 'one-time',
    discountPercentage: 15,
    monthlyMonths: 4,
    autoChargeMethod: '',
    ccType: 'Visa',
    ccNumberLast4: '',
    bankName: '',
    routingNumber: '',
    accountNumberLast4: '',
    financingMonths: 18,
    patientSignatureDate: "",
    staffSignatureDate: ""
  });

  useEffect(() => {
    if (existingPlanId) {
      const saved = localStorage.getItem(`financialPlan_${existingPlanId}`);
      if (saved) {
        setPlan(JSON.parse(saved));
      }
    }
  }, [existingPlanId]);

  // Derived calculations
  const discountSavings = plan.totalInvestment * (plan.discountPercentage / 100);
  const oneTimePaymentTotal = plan.totalInvestment - discountSavings;
  
  const monthlyPaymentAmount = plan.totalInvestment / Math.max(1, plan.monthlyMonths);
  
  const financingPaymentMonthly = plan.totalInvestment / Math.max(1, plan.financingMonths);
  const financingPaymentDaily = financingPaymentMonthly / 30;

  const handleSave = () => {
    localStorage.setItem(`financialPlan_${plan.id}`, JSON.stringify(plan));
    onSave(plan);
  };

  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 px-6 py-4 bg-neutral-50 dark:bg-neutral-800/50">
        <div className="flex items-center gap-4">
          <button onClick={onCancel} className="text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
            {existingPlanId ? "Edit Financial Agreement" : "New Financial Agreement"}
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-3 py-2 text-sm font-medium text-neutral-700 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 shadow-sm flex items-center gap-2 hidden sm:flex">
             <Printer className="w-4 h-4"/> Print PDF
          </button>
          <button onClick={handleSave} className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 shadow-sm flex items-center gap-2">
            <Save className="w-4 h-4" /> Save Agreement
          </button>
        </div>
      </div>

      <div className="p-8 w-full mx-auto space-y-10">
        
        {/* Meta Info */}
        <div className="flex justify-between items-center text-sm text-neutral-900 dark:text-neutral-100 font-medium">
           <div>Patient Name: <span className="font-semibold text-primary-700">{patientName}</span></div>
           <div className="flex items-center gap-2">Date Prepared: 
              <input type="date" value={plan.datePrepared.split('T')[0]} onChange={(e) => setPlan(p => ({...p, datePrepared: e.target.value}))} className="px-2 py-1 border border-neutral-300 dark:border-neutral-700 rounded bg-white dark:bg-neutral-800 outline-none focus:ring-1 focus:ring-primary-500" />
           </div>
        </div>

        {/* Agreement Text */}
        <div className="space-y-4 text-sm text-neutral-700 dark:text-neutral-300">
           <p className="flex items-center flex-wrap gap-2 leading-relaxed">
             This corrective plan includes all procedures recommended by the doctor during the time period of 
             <input type="date" value={plan.startDate} onChange={e => setPlan(p => ({...p, startDate: e.target.value}))} className="w-32 px-2 py-0.5 border-b border-neutral-400 bg-transparent outline-none focus:border-primary-500 font-semibold" /> 
             to 
             <input type="date" value={plan.endDate} onChange={e => setPlan(p => ({...p, endDate: e.target.value}))} className="w-32 px-2 py-0.5 border-b border-neutral-400 bg-transparent outline-none focus:border-primary-500 font-semibold" />
           </p>
           <p className="text-xs italic text-neutral-500">Any work injury or personal injury (e.g. auto accident) would suspend this plan until that condition was resolved. The plan would then continue and be extended for the unused time purchased.</p>
        </div>

        {/* Investment Summary */}
        <div className="grid grid-cols-[150px_1fr] gap-y-3 font-semibold text-neutral-900 dark:text-white border-y border-neutral-200 dark:border-neutral-800 py-6">
           <div className="text-right pr-6 self-center">${plan.totalInvestment.toFixed(2)}</div>
           <div className="text-neutral-600 dark:text-neutral-400 font-medium">Doctor Recommended Adjustments and Therapy</div>

           <div className="text-right pr-6 self-center pb-2 relative">
             <span className="absolute left-6 top-1/2 -translate-y-1/2 text-neutral-400">$</span>
             <input 
               type="number" 
               value={plan.totalInvestment} 
               onChange={e => setPlan(p => ({...p, totalInvestment: parseFloat(e.target.value) || 0}))} 
               className="w-full text-right px-2 py-1 border-b-2 border-primary-500 text-lg font-bold bg-primary-50 dark:bg-primary-900/20 outline-none"
             />
           </div>
           <div className="text-primary-700 dark:text-primary-400 text-lg self-center pb-2">Total Investment</div>
        </div>

        {/* Payment Options */}
        <div className="space-y-6">
           
           {/* Option 1: One Time */}
           <div className={`border-2 rounded-xl p-5 transition-colors ${plan.selectedPaymentMode === 'one-time' ? 'border-primary-600 bg-primary-50/30 dark:bg-primary-900/10' : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 cursor-pointer'}`} onClick={() => setPlan(p => ({...p, selectedPaymentMode: 'one-time'}))}>
             <div className="flex items-center gap-3 mb-4">
               <input type="radio" checked={plan.selectedPaymentMode === 'one-time'} readOnly className="w-4 h-4 text-primary-600 border-neutral-300 focus:ring-primary-600" />
               <h3 className="font-bold text-neutral-900 dark:text-white">One Time Payment <span className="font-normal text-sm text-neutral-600">(Pay in Advance Save {plan.discountPercentage}%)</span></h3>
             </div>
             
             <div className="grid grid-cols-[1fr_auto] gap-y-2 text-sm ml-7">
                <div className="text-neutral-600 flex items-center gap-2">
                  <input type="number" value={plan.discountPercentage} onClick={(e) => e.stopPropagation()} onChange={e => setPlan(p => ({...p, discountPercentage: parseFloat(e.target.value) || 0}))} className="w-12 px-1 py-0.5 border border-neutral-300 rounded text-center"/> % Discount for Pay in Advance
                </div>
                <div className="text-right font-medium text-success-600">-${discountSavings.toFixed(2)} (SAVINGS)</div>
                
                <div className="font-bold text-neutral-900 dark:text-white mt-2">Total Payment: <span className="font-normal italic text-xs text-neutral-500 ml-1">(Available next 5 days only)</span></div>
                <div className="text-right font-bold text-base mt-2">${oneTimePaymentTotal.toFixed(2)} (TOTAL)</div>
             </div>
           </div>

           {/* Option 2: Monthly */}
           <div className={`border-2 rounded-xl p-5 transition-colors ${plan.selectedPaymentMode === 'monthly' ? 'border-primary-600 bg-primary-50/30 dark:bg-primary-900/10' : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 cursor-pointer'}`} onClick={() => setPlan(p => ({...p, selectedPaymentMode: 'monthly'}))}>
             <div className="flex items-center gap-3 mb-4">
               <input type="radio" checked={plan.selectedPaymentMode === 'monthly'} readOnly className="w-4 h-4 text-primary-600 border-neutral-300 focus:ring-primary-600" />
               <h3 className="font-bold text-neutral-900 dark:text-white">Monthly Payment</h3>
             </div>
             
             <div className="ml-7 space-y-4 text-sm">
                <div className="flex items-center flex-wrap gap-2 font-medium">
                  Total Investment: <span className="font-bold text-primary-700 underline underline-offset-2">${plan.totalInvestment.toFixed(2)}</span> divided by 
                  <input type="number" min="1" onClick={(e) => e.stopPropagation()} value={plan.monthlyMonths} onChange={e => setPlan(p => ({...p, monthlyMonths: parseInt(e.target.value) || 1}))} className="w-12 px-2 py-0.5 border border-neutral-300 rounded text-center mx-1"/> months:
                  <span className="font-bold text-lg text-neutral-900 dark:text-white ml-2">${monthlyPaymentAmount.toFixed(2)}</span>
                </div>
                
                {/* Auto Charge Settings */}
                <div className="space-y-4 pt-4 border-t border-neutral-200 dark:border-neutral-800" onClick={(e) => e.stopPropagation()}>
                   
                   <label className="flex items-start gap-3">
                     <input type="radio" name="autoMethod" checked={plan.autoChargeMethod === 'credit_card'} onChange={() => setPlan(p => ({...p, autoChargeMethod: 'credit_card'}))} className="mt-1" />
                     <div className="flex-1">
                       <span className="font-medium text-neutral-800 dark:text-neutral-200 block mb-2">Auto Charge Credit Card</span>
                       <div className="flex items-center gap-3">
                         <select value={plan.ccType} onChange={e => setPlan(p => ({...p, ccType: e.target.value}))} className="px-3 py-1.5 border border-neutral-300 rounded-lg text-sm disabled:opacity-50" disabled={plan.autoChargeMethod !== 'credit_card'}>
                           <option>Visa</option>
                           <option>MasterCard</option>
                           <option>Discover</option>
                           <option>Amex</option>
                         </select>
                         <div className="flex items-center flex-1 gap-2 border border-neutral-300 px-3 py-1.5 rounded-lg bg-white disabled:opacity-50">
                            <CreditCard className="w-4 h-4 text-neutral-400" />
                            <span className="text-neutral-400 font-mono tracking-widest">**** **** ****</span>
                            <input type="text" maxLength={4} placeholder="1234" value={plan.ccNumberLast4} onChange={e => setPlan(p => ({...p, ccNumberLast4: e.target.value}))} className="w-12 outline-none font-mono" disabled={plan.autoChargeMethod !== 'credit_card'} />
                         </div>
                       </div>
                     </div>
                   </label>

                   <label className="flex items-start gap-3">
                     <input type="radio" name="autoMethod" checked={plan.autoChargeMethod === 'bank_debit'} onChange={() => setPlan(p => ({...p, autoChargeMethod: 'bank_debit'}))} className="mt-1" />
                     <div className="flex-1">
                       <span className="font-medium text-neutral-800 dark:text-neutral-200 block mb-2">Auto Bank Debit</span>
                       <div className="grid grid-cols-[1fr_1fr_auto] gap-3">
                         <div className="flex items-center border border-neutral-300 px-3 py-1.5 rounded-lg bg-white focus-within:border-primary-500">
                            <Building className="w-4 h-4 text-neutral-400 mr-2" />
                            <input type="text" placeholder="Institution Name" value={plan.bankName} onChange={e => setPlan(p => ({...p, bankName: e.target.value}))} className="w-full outline-none text-sm" disabled={plan.autoChargeMethod !== 'bank_debit'} />
                         </div>
                         <div className="flex items-center border border-neutral-300 px-3 py-1.5 rounded-lg bg-white focus-within:border-primary-500">
                            <input type="text" placeholder="Routing Number" value={plan.routingNumber} onChange={e => setPlan(p => ({...p, routingNumber: e.target.value}))} className="w-full outline-none text-sm font-mono" disabled={plan.autoChargeMethod !== 'bank_debit'} />
                         </div>
                         <div className="flex items-center border border-neutral-300 px-3 py-1.5 rounded-lg bg-white focus-within:border-primary-500">
                            <span className="text-neutral-400 font-mono tracking-widest mr-2">****</span>
                            <input type="text" maxLength={4} placeholder="4321" value={plan.accountNumberLast4} onChange={e => setPlan(p => ({...p, accountNumberLast4: e.target.value}))} className="w-12 outline-none font-mono" disabled={plan.autoChargeMethod !== 'bank_debit'} />
                         </div>
                       </div>
                     </div>
                   </label>
                   
                </div>
             </div>
           </div>

           {/* Option 3: Financing */}
           <div className={`border-2 rounded-xl p-5 transition-colors ${plan.selectedPaymentMode === 'financing' ? 'border-primary-600 bg-primary-50/30 dark:bg-primary-900/10' : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 cursor-pointer'}`} onClick={() => setPlan(p => ({...p, selectedPaymentMode: 'financing'}))}>
             <div className="flex items-center gap-3 mb-4">
               <input type="radio" checked={plan.selectedPaymentMode === 'financing'} readOnly className="w-4 h-4 text-primary-600 border-neutral-300 focus:ring-primary-600" />
               <h3 className="font-bold text-neutral-900 dark:text-white">Financing <span className="font-normal text-sm text-neutral-600">(100% Interest Free Financing Option - Care Credit)</span></h3>
             </div>
             
             <div className="grid grid-cols-[1fr_auto] gap-y-2 text-sm ml-7">
                <div className="text-neutral-600 flex items-center gap-2">
                  <span className="font-bold text-neutral-900 dark:text-white w-28">Monthly Payment</span>
                </div>
                <div className="text-right font-medium">
                  <span className="font-bold border-b border-neutral-300 mr-2 px-2">${financingPaymentMonthly.toFixed(2)}</span>
                  for <input type="number" onClick={(e) => e.stopPropagation()} value={plan.financingMonths} onChange={e => setPlan(p => ({...p, financingMonths: parseInt(e.target.value) || 12}))} className="w-12 px-1 border-b border-neutral-400 bg-transparent text-center mx-1 outline-none"/> months
                </div>
                
                <div className="text-neutral-600 flex items-center gap-2 mt-2">
                  <span className="w-28">Approximately</span>
                </div>
                <div className="text-right font-bold text-base mt-2 text-neutral-900 dark:text-white">
                   ${financingPaymentDaily.toFixed(2)} <span className="font-normal text-sm">a day</span>
                </div>
             </div>
           </div>
        </div>

        {/* Contract Fine Print */}
        <p className="text-[10px] text-justify text-neutral-400 leading-tight">
          By signing below, I agree to participate in a Chiropractic Corrective Program. If I've selected a payment plan, my credit card or checking account will be automatically charged on the period specified above. To cancel or change this request I must notify the Clinic in writing and allow a reasonable time to accommodate my request. Should I choose to discontinue my care at any time, I will not be billed for any care not yet received and I will only be responsible for the balance of the care that I have already received.
        </p>

        {/* Signatures */}
        <div className="grid grid-cols-[1fr_120px_1fr] gap-8 pt-10 mt-8">
           <div className="flex flex-col gap-2 relative">
             {plan.patientSignatureDate ? (
                <div className="h-10 text-primary-700 font-serif italic text-xl border-b border-neutral-400 mb-1">Signed Digitally</div>
             ) : (
                <button onClick={() => setPlan(prev => ({...prev, patientSignatureDate: new Date().toISOString()}))} className="h-10 text-sm font-medium text-neutral-500 hover:text-primary-600 border-b border-neutral-400 mb-1 text-left w-full hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition duration-150">Click to Sign Agreement</button>
             )}
             <span className="text-xs font-medium text-neutral-500 uppercase tracking-widest">*Signature of Responsible Party</span>
           </div>
           <div className="flex flex-col gap-2 text-center">
             <div className="h-10 border-b border-neutral-400 mb-1 flex items-end justify-center pb-1 font-semibold text-neutral-800 dark:text-neutral-200">
                {plan.patientSignatureDate ? new Date(plan.patientSignatureDate).toLocaleDateString() : ""}
             </div>
             <span className="text-xs font-medium text-neutral-500 uppercase tracking-widest">Date</span>
           </div>
           <div className="flex flex-col gap-2 relative text-right">
             {plan.staffSignatureDate ? (
                <div className="h-10 text-primary-700 font-serif italic text-xl border-b border-neutral-400 mb-1">Verified By Staff</div>
             ) : (
                <button onClick={() => setPlan(prev => ({...prev, staffSignatureDate: new Date().toISOString()}))} className="h-10 text-sm font-medium text-neutral-500 hover:text-primary-600 border-b border-neutral-400 mb-1 text-right w-full hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition duration-150">Verify Identity</button>
             )}
             <span className="text-xs font-medium text-neutral-500 uppercase tracking-widest">Staff Signature</span>
           </div>
        </div>

      </div>
    </div>
  );
}
