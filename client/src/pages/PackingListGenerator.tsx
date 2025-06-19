import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Download, Mail, Printer, CheckSquare, Square } from "lucide-react";
import jsPDF from 'jspdf';
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PromotionalBanners from "@/components/PromotionalBanners";

interface PackingItem {
  id: string;
  name: string;
  required: boolean;
  conditions?: string[];
}

interface PackingSection {
  title: string;
  items: PackingItem[];
}

const disciplines = [
  { id: "dressage", label: "Dressage" },
  { id: "showjumping", label: "Show Jumping" },
  { id: "eventing", label: "Eventing / Cross Country" },
  { id: "combined", label: "Combined Training / Arena Eventing" }
];

const extraOptions = [
  { id: "plaiting", label: "I plan to plait" },
  { id: "overnight", label: "I'm staying overnight" },
  { id: "groom", label: "I'm taking a groom/helper" }
];

const packingSections: PackingSection[] = [
  {
    title: "Rider Gear",
    items: [
      { id: "show-jacket", name: "Show jacket", required: true },
      { id: "stock-tie", name: "Stock/tie + pin", required: true },
      { id: "white-shirt", name: "White shirt", required: true },
      { id: "light-breeches", name: "Light-coloured breeches", required: true },
      { id: "gloves", name: "Gloves", required: true, conditions: ["dressage", "eventing"] },
      { id: "hairnet", name: "Hairnet & show socks", required: true },
      { id: "competition-boots", name: "Competition boots", required: true },
      { id: "number-bib", name: "Number bib", required: true },
      { id: "dressage-hat", name: "Dressage/show jumping hat", required: true, conditions: ["eventing"] },
      { id: "xc-hat", name: "Cross-country hat", required: true, conditions: ["eventing"] },
      { id: "body-protector", name: "Body protector", required: true, conditions: ["eventing"] },
      { id: "eventing-watch", name: "Eventing watch (optional)", required: false, conditions: ["eventing"] }
    ]
  },
  {
    title: "Horse Gear - Dressage",
    items: [
      { id: "dressage-bridle", name: "Dressage bridle", required: true, conditions: ["dressage", "eventing"] },
      { id: "dressage-saddle", name: "Dressage saddle", required: true, conditions: ["dressage", "eventing"] },
      { id: "dressage-numnah", name: "Dressage numnah", required: true, conditions: ["dressage", "eventing"] },
      { id: "dressage-pad", name: "Dressage saddle pad", required: true, conditions: ["dressage", "eventing"] },
      { id: "dressage-girth", name: "Girth", required: true, conditions: ["dressage", "eventing"] }
    ]
  },
  {
    title: "Horse Gear - Show Jumping",
    items: [
      { id: "jumping-saddle", name: "Jumping saddle", required: true, conditions: ["showjumping", "combined", "eventing"] },
      { id: "jumping-bridle", name: "Jumping bridle", required: true, conditions: ["showjumping", "combined", "eventing"] },
      { id: "martingale", name: "Martingale (if used)", required: false, conditions: ["showjumping", "combined", "eventing"] },
      { id: "jumping-boots", name: "Jumping boots (tendon/fetlock)", required: true, conditions: ["showjumping", "combined", "eventing"] },
      { id: "sj-overreach", name: "Overreach boots", required: true, conditions: ["showjumping", "combined", "eventing"] },
      { id: "jumping-numnah", name: "Jumping numnah", required: true, conditions: ["showjumping", "combined", "eventing"] },
      { id: "jumping-pad", name: "Jumping saddle pad", required: true, conditions: ["showjumping", "combined", "eventing"] }
    ]
  },
  {
    title: "Horse Gear - Cross Country",
    items: [
      { id: "xc-bridle", name: "Cross-country bridle and bit", required: true, conditions: ["eventing"] },
      { id: "xc-saddle", name: "Cross-country saddle (usually same as SJ)", required: true, conditions: ["eventing"] },
      { id: "breastplate", name: "Breastplate", required: true, conditions: ["eventing"] },
      { id: "xc-boots", name: "Cross-country boots", required: true, conditions: ["eventing"] },
      { id: "xc-overreach", name: "Overreach boots", required: true, conditions: ["eventing"] },
      { id: "studs", name: "Studs and stud kit (always use studs)", required: true, conditions: ["eventing"] }
    ]
  },
  {
    title: "Other Horse Kit",
    items: [
      { id: "headcollar", name: "Headcollar & lead rope", required: true },
      { id: "passport", name: "Passport", required: true },
      { id: "rugs", name: "Rugs (stable, fleece, cooler)", required: true },
      { id: "travel-boots", name: "Travel boots", required: true },
      { id: "tail-guard", name: "Tail guard", required: true },
      { id: "grooming-kit", name: "Grooming kit", required: true },
      { id: "hoof-pick", name: "Hoof pick", required: true },
      { id: "water-bucket", name: "Water bucket & sponge", required: true },
      { id: "wash-bucket", name: "Wash bucket", required: true },
      { id: "feed", name: "Feed", required: true, conditions: ["overnight"] },
      { id: "treats", name: "Treats/snacks (optional)", required: false },
      { id: "plaiting-kit", name: "Plaiting kit", required: true, conditions: ["plaiting"] }
    ]
  },
  {
    title: "Yard & Tackroom Kit",
    items: [
      { id: "spare-tack", name: "Spare tack (girth, reins, stirrup leathers)", required: true },
      { id: "tack-kit", name: "Tack cleaning kit", required: true },
      { id: "mounting-block", name: "Mounting/plaiting block", required: true },
      { id: "muck-tools", name: "Muck-out tools", required: true, conditions: ["overnight"] }
    ]
  },
  {
    title: "Helper/Groom Extras",
    items: [
      { id: "clipboard", name: "Clipboard with schedule", required: true, conditions: ["groom"] },
      { id: "pen", name: "Pen or marker", required: true, conditions: ["groom"] },
      { id: "first-aid", name: "First aid kit", required: true, conditions: ["groom"] },
      { id: "chair", name: "Folding chair", required: true, conditions: ["groom"] },
      { id: "charger", name: "Phone charger or power bank", required: true, conditions: ["groom"] }
    ]
  },
  {
    title: "Overnight Extras",
    items: [
      { id: "bedding", name: "Bedding", required: true, conditions: ["overnight"] },
      { id: "hay", name: "Hay & feed", required: true, conditions: ["overnight"] },
      { id: "feed-bucket", name: "Feed bucket & scoop", required: true, conditions: ["overnight"] },
      { id: "head-torch", name: "Head torch", required: true, conditions: ["overnight"] },
      { id: "spare-clothes", name: "Spare clothes", required: true, conditions: ["overnight"] },
      { id: "toiletries", name: "Toiletries", required: true, conditions: ["overnight"] },
      { id: "extension-lead", name: "Extension lead", required: true, conditions: ["overnight"] },
      { id: "lunge-line", name: "Lunge line", required: true, conditions: ["overnight"] }
    ]
  }
];

export default function PackingListGenerator() {
  const [selectedDisciplines, setSelectedDisciplines] = useState<string[]>([]);
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState<'disciplines' | 'extras' | 'checklist'>('disciplines');

  const handleDisciplineChange = (disciplineId: string, checked: boolean) => {
    if (checked) {
      setSelectedDisciplines(prev => [...prev, disciplineId]);
    } else {
      setSelectedDisciplines(prev => prev.filter(id => id !== disciplineId));
    }
  };

  const handleExtraChange = (extraId: string, checked: boolean) => {
    if (checked) {
      setSelectedExtras(prev => [...prev, extraId]);
    } else {
      setSelectedExtras(prev => prev.filter(id => id !== extraId));
    }
  };

  const handleItemCheck = (itemId: string, checked: boolean) => {
    if (checked) {
      setCheckedItems(prev => [...prev, itemId]);
    } else {
      setCheckedItems(prev => prev.filter(id => id !== itemId));
    }
  };

  const getFilteredItems = () => {
    const allConditions = [...selectedDisciplines, ...selectedExtras];
    
    return packingSections.map(section => {
      const filteredItems = section.items.filter(item => {
        if (!item.conditions) return true;
        return item.conditions.some(condition => allConditions.includes(condition));
      });
      
      return {
        ...section,
        items: filteredItems
      };
    }).filter(section => section.items.length > 0);
  };

  const generateChecklistText = () => {
    const filteredSections = getFilteredItems();
    let text = "COMPETITION PACKING CHECKLIST\n\n";
    
    const disciplineText = selectedDisciplines.map(d => 
      disciplines.find(disc => disc.id === d)?.label
    ).join(", ");
    text += `Disciplines: ${disciplineText}\n`;
    
    if (selectedExtras.length > 0) {
      const extrasText = selectedExtras.map(e => 
        extraOptions.find(opt => opt.id === e)?.label
      ).join(", ");
      text += `Extras: ${extrasText}\n`;
    }
    text += "\n";
    
    filteredSections.forEach(section => {
      text += `${section.title.toUpperCase()}\n`;
      text += "─".repeat(section.title.length) + "\n";
      section.items.forEach(item => {
        const checked = checkedItems.includes(item.id) ? "☑" : "☐";
        text += `${checked} ${item.name}\n`;
      });
      text += "\n";
    });
    
    return text;
  };

  const downloadPDF = () => {
    try {
      const pdf = new jsPDF();
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 20;
      const lineHeight = 8;
      let yPosition = 25;

      // Add header background color
      pdf.setFillColor(25, 56, 97); // Navy blue background
      pdf.rect(0, 0, pageWidth, 50, 'F');

      // Add logo area (placeholder for now)
      pdf.setFillColor(255, 255, 255); // White background for logo
      pdf.rect(margin, 10, 40, 30, 'F');
      pdf.setFontSize(8);
      pdf.setTextColor(25, 56, 97);
      pdf.text('Dan Bizzarro', margin + 2, 20);
      pdf.text('Eventing', margin + 2, 27);
      pdf.text('Method', margin + 2, 34);

      // Add title
      pdf.setFontSize(20);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(255, 255, 255); // White text
      pdf.text('Competition Packing Checklist', margin + 50, 30);
      
      // Reset text color for content
      pdf.setTextColor(0, 0, 0);
      yPosition = 65;
      
      // Add discipline and date info with colored background
      pdf.setFillColor(240, 248, 255); // Light blue background
      pdf.rect(margin, yPosition - 5, pageWidth - 2 * margin, 20, 'F');
      
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(25, 56, 97); // Navy text
      const selectedDisciplineLabels = selectedDisciplines.map(d => 
        disciplines.find(disc => disc.id === d)?.label || d
      ).join(', ');
      pdf.text(`Discipline: ${selectedDisciplineLabels}`, margin + 5, yPosition + 5);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Generated: ${new Date().toLocaleDateString()}`, margin + 5, yPosition + 12);
      
      pdf.setTextColor(0, 0, 0); // Reset to black
      yPosition += 30;

      filteredSections.forEach((section, sectionIndex) => {
        // Check if we need a new page
        if (yPosition + (section.items.length * lineHeight) + 25 > pageHeight - margin) {
          pdf.addPage();
          // Add header to new page
          pdf.setFillColor(25, 56, 97);
          pdf.rect(0, 0, pageWidth, 25, 'F');
          pdf.setFontSize(10);
          pdf.setTextColor(255, 255, 255);
          pdf.text('Dan Bizzarro Method - Competition Packing Checklist', margin, 15);
          pdf.setTextColor(0, 0, 0);
          yPosition = 35;
        }

        // Section header with colored background
        const sectionColors = [
          [76, 175, 80],   // Green
          [33, 150, 243],  // Blue  
          [255, 152, 0],   // Orange
          [156, 39, 176],  // Purple
          [255, 87, 34]    // Red-orange
        ];
        const colorIndex = sectionIndex % sectionColors.length;
        const [r, g, b] = sectionColors[colorIndex];
        
        pdf.setFillColor(r, g, b);
        pdf.rect(margin, yPosition - 2, pageWidth - 2 * margin, 12, 'F');
        
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(255, 255, 255); // White text on colored background
        pdf.text(section.title, margin + 5, yPosition + 6);
        
        pdf.setTextColor(0, 0, 0); // Reset to black
        yPosition += 15;
        
        // Section items with checkboxes
        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'normal');
        
        section.items.forEach((item, itemIndex) => {
          // Check if we need a new page
          if (yPosition > pageHeight - margin - 15) {
            pdf.addPage();
            // Add header to new page
            pdf.setFillColor(25, 56, 97);
            pdf.rect(0, 0, pageWidth, 25, 'F');
            pdf.setFontSize(10);
            pdf.setTextColor(255, 255, 255);
            pdf.text('Dan Bizzarro Method - Competition Packing Checklist', margin, 15);
            pdf.setTextColor(0, 0, 0);
            yPosition = 35;
          }

          // Alternating row colors for better readability
          if (itemIndex % 2 === 0) {
            pdf.setFillColor(248, 249, 250); // Light gray
            pdf.rect(margin, yPosition - 2, pageWidth - 2 * margin, lineHeight, 'F');
          }

          // Draw checkbox with colored border
          const checkboxSize = 4;
          const checkboxX = margin + 5;
          const checkboxY = yPosition - 3;
          
          pdf.setDrawColor(r, g, b); // Use section color for checkbox border
          pdf.setLineWidth(0.5);
          pdf.rect(checkboxX, checkboxY, checkboxSize, checkboxSize, 'S');
          
          // If item is checked, add checkmark
          if (checkedItems.includes(item.id)) {
            pdf.setFontSize(8);
            pdf.setTextColor(r, g, b);
            pdf.text('✓', checkboxX + 0.8, checkboxY + 2.8);
            pdf.setTextColor(0, 0, 0);
            pdf.setFontSize(11);
          }
          
          // Add item text with word wrapping
          const maxWidth = pageWidth - margin - checkboxSize - 15;
          const textLines = pdf.splitTextToSize(item.name, maxWidth);
          pdf.text(textLines, margin + checkboxSize + 10, yPosition);
          
          yPosition += lineHeight * Math.max(1, textLines.length);
        });
        
        yPosition += 12; // Extra space between sections
      });

      // Add footer to all pages
      const pageCount = pdf.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        
        // Footer background
        pdf.setFillColor(25, 56, 97);
        pdf.rect(0, pageHeight - 20, pageWidth, 20, 'F');
        
        pdf.setFontSize(8);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(255, 255, 255);
        pdf.text(`Page ${i} of ${pageCount}`, margin, pageHeight - 8);
        pdf.text('Dan Bizzarro Method', pageWidth - margin - 40, pageHeight - 8);
        
        // Add website
        pdf.setFontSize(7);
        pdf.text('www.danbizzarromethod.com', pageWidth - margin - 50, pageHeight - 3);
      }

      pdf.save('competition-packing-checklist.pdf');
    } catch (error) {
      console.error('PDF generation error:', error);
      // Fallback to text download
      const text = generateChecklistText();
      const blob = new Blob([text], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'competition-packing-checklist.txt';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      alert('PDF generation failed. Downloaded as text file instead.');
    }
  };

  const printChecklist = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      const selectedDiscipline = disciplines.find(d => d.id === discipline);
      
      let printContent = `
        <html>
          <head>
            <title>Competition Packing Checklist</title>
            <style>
              body { 
                font-family: Arial, sans-serif; 
                margin: 20px; 
                line-height: 1.6;
              }
              .header {
                text-align: center;
                margin-bottom: 30px;
                border-bottom: 2px solid #333;
                padding-bottom: 10px;
              }
              .section {
                margin-bottom: 25px;
              }
              .section-title {
                font-size: 16px;
                font-weight: bold;
                margin-bottom: 10px;
                color: #333;
                border-bottom: 1px solid #ccc;
                padding-bottom: 3px;
              }
              .checkbox-item {
                display: flex;
                align-items: center;
                margin-bottom: 8px;
                padding-left: 10px;
              }
              .checkbox {
                width: 15px;
                height: 15px;
                border: 2px solid #333;
                margin-right: 10px;
                display: inline-block;
                position: relative;
              }
              .checkbox.checked::after {
                content: '✓';
                position: absolute;
                left: 2px;
                top: -2px;
                font-size: 12px;
                font-weight: bold;
              }
              .footer {
                margin-top: 40px;
                text-align: center;
                font-size: 12px;
                color: #666;
                border-top: 1px solid #ccc;
                padding-top: 10px;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Competition Packing Checklist</h1>
              <p><strong>Discipline:</strong> ${selectedDiscipline?.label || 'Not selected'}</p>
              <p><strong>Generated:</strong> ${new Date().toLocaleDateString()}</p>
            </div>
      `;

      filteredSections.forEach(section => {
        printContent += `
          <div class="section">
            <div class="section-title">${section.title}</div>
        `;
        
        section.items.forEach(item => {
          const isChecked = checkedItems.includes(item.id);
          printContent += `
            <div class="checkbox-item">
              <span class="checkbox ${isChecked ? 'checked' : ''}"></span>
              <span>${item.name}</span>
            </div>
          `;
        });
        
        printContent += `</div>`;
      });

      printContent += `
            <div class="footer">
              Dan Bizzarro Method - Competition Preparation
            </div>
          </body>
        </html>
      `;

      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const emailChecklist = () => {
    const text = generateChecklistText();
    const subject = "Competition Packing Checklist";
    const body = encodeURIComponent(text);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  if (currentStep === 'disciplines') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Navigation />
        <div className="pt-24 pb-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-playfair font-bold text-navy mb-4">
                Competition Packing List Generator
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Create a personalized packing checklist based on your competition disciplines and needs
              </p>
            </div>

            <Card className="bg-white shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl text-center">Step 1: Select Your Discipline(s)</CardTitle>
                <CardDescription className="text-center">
                  Choose all disciplines you'll be competing in
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  {disciplines.map((discipline) => (
                    <div key={discipline.id} className="flex items-center space-x-3 p-4 border-2 rounded-lg hover:bg-blue-50 transition-colors">
                      <Checkbox
                        id={discipline.id}
                        checked={selectedDisciplines.includes(discipline.id)}
                        onCheckedChange={(checked) => handleDisciplineChange(discipline.id, !!checked)}
                      />
                      <Label htmlFor={discipline.id} className="text-lg font-medium cursor-pointer">
                        {discipline.label}
                      </Label>
                    </div>
                  ))}
                </div>

                <div className="text-center">
                  <Button
                    onClick={() => setCurrentStep('extras')}
                    disabled={selectedDisciplines.length === 0}
                    size="lg"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8"
                  >
                    Continue to Optional Extras
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (currentStep === 'extras') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Navigation />
        <div className="pt-24 pb-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="bg-white shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl text-center">Step 2: Optional Extras</CardTitle>
                <CardDescription className="text-center">
                  Select any additional requirements (optional)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4 mb-8">
                  {extraOptions.map((extra) => (
                    <div key={extra.id} className="flex items-center space-x-3 p-4 border-2 rounded-lg hover:bg-green-50 transition-colors">
                      <Checkbox
                        id={extra.id}
                        checked={selectedExtras.includes(extra.id)}
                        onCheckedChange={(checked) => handleExtraChange(extra.id, !!checked)}
                      />
                      <Label htmlFor={extra.id} className="text-lg font-medium cursor-pointer">
                        {extra.label}
                      </Label>
                    </div>
                  ))}
                </div>

                <div className="flex justify-center gap-4">
                  <Button
                    onClick={() => setCurrentStep('disciplines')}
                    variant="outline"
                    size="lg"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={() => setCurrentStep('checklist')}
                    size="lg"
                    className="bg-green-600 hover:bg-green-700 text-white px-8"
                  >
                    Generate My Checklist
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const filteredSections = getFilteredItems();
  const totalItems = filteredSections.reduce((sum, section) => sum + section.items.length, 0);
  const checkedCount = filteredSections.reduce((sum, section) => 
    sum + section.items.filter(item => checkedItems.includes(item.id)).length, 0
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navigation />
      <div className="pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Checklist */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg shadow-xl p-6 mb-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h1 className="text-3xl font-playfair font-bold text-navy">Your Competition Checklist</h1>
                    <p className="text-gray-600">
                      {selectedDisciplines.map(d => disciplines.find(disc => disc.id === d)?.label).join(", ")}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">{checkedCount}/{totalItems}</div>
                    <div className="text-sm text-gray-500">items packed</div>
                  </div>
                </div>

                <div className="flex gap-2 mb-6">
                  <Button onClick={downloadPDF} variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                  <Button onClick={emailChecklist} variant="outline" size="sm">
                    <Mail className="w-4 h-4 mr-2" />
                    Email
                  </Button>
                  <Button onClick={printChecklist} variant="outline" size="sm">
                    <Printer className="w-4 h-4 mr-2" />
                    Print
                  </Button>
                </div>

                <div className="space-y-6">
                  {filteredSections.map((section, sectionIndex) => (
                    <div key={section.title} className="border border-gray-200 rounded-lg p-4">
                      <h3 className="text-xl font-semibold text-navy mb-4">{section.title}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {section.items.map((item) => (
                          <div key={item.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded">
                            <Checkbox
                              id={item.id}
                              checked={checkedItems.includes(item.id)}
                              onCheckedChange={(checked) => handleItemCheck(item.id, !!checked)}
                            />
                            <Label 
                              htmlFor={item.id} 
                              className={`cursor-pointer ${checkedItems.includes(item.id) ? 'line-through text-gray-500' : ''} ${!item.required ? 'text-gray-600 italic' : ''}`}
                            >
                              {item.name}
                            </Label>
                          </div>
                        ))}
                      </div>
                      {sectionIndex < filteredSections.length - 1 && <Separator className="mt-4" />}
                    </div>
                  ))}
                </div>

                <div className="mt-8 text-center">
                  <Button
                    onClick={() => {
                      setCurrentStep('disciplines');
                      setSelectedDisciplines([]);
                      setSelectedExtras([]);
                      setCheckedItems([]);
                    }}
                    variant="outline"
                  >
                    Create New Checklist
                  </Button>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <PromotionalBanners />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}