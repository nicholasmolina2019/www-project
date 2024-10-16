// components/ProfileForm.tsx

"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Removed import of jsPDF
// import jsPDF from "jspdf";

import { toast } from "@/registry/new-york/hooks/use-toast";
import { Button } from "@/registry/new-york/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/registry/new-york/ui/form";
import { Input } from "@/registry/new-york/ui/input";
import { Textarea } from "@/registry/new-york/ui/textarea";
import { MultiSelect } from "@/components/MultiSelect";

import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/registry/new-york/ui/select";

// Define your Zod schema for form validation
const profileFormSchema = z.object({
  company: z.string().nonempty({ message: "Please select a company." }),
  dealId: z.string().nonempty({ message: "Please enter a Deal ID." }),
  bio: z
    .string()
    .max(160, { message: "Bio must not exceed 160 characters." })
    .min(4, { message: "Bio must be at least 4 characters." }),
  lumenStatus: z
    .array(z.string())
    .min(1, { message: "Select at least one Lumen Status." }),
  verificationDocuments: z
    .array(z.string())
    .min(1, { message: "Select at least one Verification Document." }),
  otherIncome: z
    .array(z.string())
    .min(1, { message: "Select at least one Other Income source." }),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

// Define option types and options
interface OptionType {
  label: string;
  value: string;
  baseUrl?: string; // Add baseUrl to company options
}

// Company options with base URLs
const companyOptions: OptionType[] = [
  {
    label: "Gables Residential",
    value: "Gables Residential",
    baseUrl: "https://gables-residential.manager.vero.lease/deals/",
  },
  {
    label: "Goldoller",
    value: "Goldoller",
    baseUrl: "https://gol-doller-vero1.manager.vero.lease/deals/",
  },
];

// Lumen Status Options (Updated)
const lumenStatusOptions: OptionType[] = [
  { label: "Highest of Applicant Group", value: "highest_applicant_group" },
  { label: "No Report/Thin File", value: "no_report_thin_file" },
  { label: "International Applicant(s)", value: "international_applicants" },
  {
    label: "Guarantor (Due to No Report/Thin File)",
    value: "guarantor_due_to_no_report",
  },
];

// Verification Documents Options (Updated to match "Income Verification Items Used")
const verificationDocumentsOptions: OptionType[] = [
  { label: "Linked Employment", value: "linked_employment" },
  { label: "Linked Bank Account(s)", value: "linked_bank_accounts" },
  { label: "OCR Financial Documents", value: "ocr_financial_documents" },
  { label: "Manually Reviewed Documents", value: "manually_reviewed_documents" },
  { label: "Guarantor Income Used", value: "guarantor_income_used" },
  { label: "Net to Gross Manual Calculation", value: "net_to_gross_manual" },
];

// Other Income Options (For income verification notes, this can be left empty or you can add new types if applicable)
const otherIncomeOptions: OptionType[] = [
  {
    label: "Other Income Details or Notes",
    value: "other_income_notes",
  },
];

// Define default values for the form
const defaultValues: Partial<ProfileFormValues> = {
  company: "",
  dealId: "",
  bio: "",
  lumenStatus: [],
  verificationDocuments: [],
  otherIncome: [],
};

export function ProfileForm() {
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: "onChange",
  });

  // State to hold the selected company object
  const [selectedCompany, setSelectedCompany] = useState<OptionType | null>(
    null
  );

  // State to hold the full URL
  const [fullUrl, setFullUrl] = useState("");

  // Watch form values and update fullUrl when dealId or selectedCompany changes
  useEffect(() => {
    const subscription = form.watch((values) => {
      const { dealId } = values;
      if (selectedCompany && selectedCompany.baseUrl && dealId) {
        const newFullUrl = selectedCompany.baseUrl.endsWith("/")
          ? `${selectedCompany.baseUrl}${dealId}`
          : `${selectedCompany.baseUrl}/${dealId}`;
        setFullUrl(newFullUrl);
      } else {
        setFullUrl("");
      }
    });
    return () => subscription.unsubscribe();
  }, [form, selectedCompany]);

  // Mapping functions
  function getOptionLabel(options: OptionType[], value: string): string {
    const option = options.find((opt) => opt.value === value);
    return option ? option.label : value;
  }

  function getOptionLabels(options: OptionType[], values: string[]): string[] {
    return values.map((value) => getOptionLabel(options, value));
  }

  // Function to sanitize strings for filenames
  function sanitizeFilename(name: string): string {
    return name.replace(/[/\\?%*:|"<>]/g, "-");
  }

  // Generate PDF function
  async function generatePDF(formData: ProfileFormValues) {
    // Dynamically import jsPDF
    const { jsPDF } = await import("jspdf");

    // Create a new jsPDF instance
    const doc = new jsPDF();

    // Add content to the PDF
    let yPosition = 20; // Starting vertical position on the page

    // Title
    doc.setFontSize(16);
    doc.text("Checklist", 105, yPosition, { align: "center" });
    yPosition += 10;

    // Company and Deal ID
    doc.setFontSize(12);
    doc.text(`Company: ${formData.company}`, 10, yPosition);
    yPosition += 7;
    doc.text(`Deal ID: ${formData.dealId}`, 10, yPosition);
    yPosition += 10;

    // Bio
    doc.text("Bio:", 10, yPosition);
    yPosition += 7;
    doc.text(formData.bio, 10, yPosition);
    yPosition += 10;

    // Lumen Status
    doc.text("Lumen Status:", 10, yPosition);
    yPosition += 7;
    const lumenStatusLabels = getOptionLabels(
      lumenStatusOptions,
      formData.lumenStatus
    );
    lumenStatusLabels.forEach((status) => {
      doc.text(`- ${status}`, 15, yPosition);
      yPosition += 7;
    });
    yPosition += 5;

    // Verification Documents
    doc.text("Income Verification Items Used:", 10, yPosition);
    yPosition += 7;
    const verificationDocumentsLabels = getOptionLabels(
      verificationDocumentsOptions,
      formData.verificationDocuments
    );
    verificationDocumentsLabels.forEach((docItem) => {
      doc.text(`- ${docItem}`, 15, yPosition);
      yPosition += 7;
    });
    yPosition += 5;

    // Other Income
    doc.text("Income Verification Notes:", 10, yPosition);
    yPosition += 7;
    const otherIncomeLabels = getOptionLabels(
      otherIncomeOptions,
      formData.otherIncome
    );
    otherIncomeLabels.forEach((income) => {
      doc.text(`- ${income}`, 15, yPosition);
      yPosition += 7;
    });
    yPosition += 10;

    // Compute full URL
    let fullUrl = "";
    if (selectedCompany && selectedCompany.baseUrl && formData.dealId) {
      if (selectedCompany.baseUrl.endsWith("/")) {
        fullUrl = `${selectedCompany.baseUrl}${formData.dealId}`;
      } else {
        fullUrl = `${selectedCompany.baseUrl}/${formData.dealId}`;
      }
    }

    // URL
    doc.text(`URL: ${fullUrl}`, 10, yPosition);
    yPosition += 10;

    // Prepare filename
    const companyName = formData.company;
    const dealId = formData.dealId;
    const filename = sanitizeFilename(
      `VERO1 - ${companyName} Checklist Deal: ${dealId}.pdf`
    );

    // Save the PDF with the new filename
    doc.save(filename);
  }

  // Function to handle form submission
  async function onSubmit(data: ProfileFormValues) {
    // Generate PDF
    await generatePDF(data);

    // Prepare toast title
    const companyName = data.company;
    const dealId = data.dealId;
    const toastTitle = `VERO1 - ${companyName} Checklist Deal ID: ${dealId}`;

    // Show the toast with a duration of 20 seconds
    toast({
      title: toastTitle,
      description:
        "Your PDF has been downloaded to your default Downloads folder.",
      duration: 20000,
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Company Dropdown Field */}
        <FormField
          control={form.control}
          name="company"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company</FormLabel>
              <FormDescription>Select a company.</FormDescription>
              <FormControl>
                <Select
                  value={field.value}
                  onValueChange={(value) => {
                    field.onChange(value);
                    const company = companyOptions.find(
                      (opt) => opt.value === value
                    );
                    setSelectedCompany(company || null);
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a company" />
                  </SelectTrigger>
                  <SelectContent>
                    {companyOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Deal ID Input */}
        {selectedCompany && (
          <FormField
            control={form.control}
            name="dealId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Deal ID</FormLabel>
                <FormDescription>
                  Enter the Deal ID. The full URL will include this ID.
                </FormDescription>
                <FormControl>
                  <Input {...field} placeholder="Enter Deal ID" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Display Full URL */}
        {selectedCompany && fullUrl && (
          <FormItem>
            <FormLabel>Full Deal URL</FormLabel>
            <FormDescription>
              This URL includes the Deal ID you entered.
            </FormDescription>
            <FormControl>
              <Input value={fullUrl} readOnly />
            </FormControl>
          </FormItem>
        )}

        {/* Bio Field */}
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormDescription>
                Deal Notes.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Lumen Status Multi-Select */}
        <FormField
          control={form.control}
          name="lumenStatus"
          render={() => (
            <FormItem>
              <FormLabel>Lumen Status</FormLabel>
              <FormDescription>
                Select one or more Lumen Status options.
              </FormDescription>
              <FormControl>
                <MultiSelect
                  control={form.control}
                  name="lumenStatus"
                  options={lumenStatusOptions}
                  placeholder="Select one or more Lumen Status"
                  required
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Verification Documents Multi-Select */}
        <FormField
          control={form.control}
          name="verificationDocuments"
          render={() => (
            <FormItem>
              <FormLabel>Verification Documents</FormLabel>
              <FormDescription>
                Select one or more Verification Documents.
              </FormDescription>
              <FormControl>
                <MultiSelect
                  control={form.control}
                  name="verificationDocuments"
                  options={verificationDocumentsOptions}
                  placeholder="Select one or more Verification Documents"
                  required
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Other Income Multi-Select */}
        <FormField
          control={form.control}
          name="otherIncome"
          render={() => (
            <FormItem>
              <FormLabel>Other Income</FormLabel>
              <FormDescription>
                Select one or more Other Income sources.
              </FormDescription>
              <FormControl>
                <MultiSelect
                  control={form.control}
                  name="otherIncome"
                  options={otherIncomeOptions}
                  placeholder="Select one or more Other Income sources"
                  required
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button type="submit">Generate Checklist</Button>
      </form>
    </Form>
  );
}
