"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import { FaLocationArrow } from "react-icons/fa6";

import { socialMedia } from "@/data";

const Footer = () => {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("sending");

    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_CONTACT_API_URL || "http://localhost:5000/api/contact",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        },
      );

      if (!response.ok) throw new Error("Unable to send message");
      setForm({ name: "", email: "", subject: "", message: "" });
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  return (
    <footer className="w-full pt-20 pb-10" id="contact">
      {/* background grid */}
      <div className="w-full absolute left-0 -bottom-72 min-h-96">
        <Image
          src="/footer-grid.svg"
          alt="grid"
          fill
          className="object-cover opacity-50"
        />
      </div>

      <div className="flex flex-col items-center">
        <h1 className="heading lg:max-w-[45vw]">
          Ready to take <span className="text-purple">your</span> digital
          presence to the next level?
        </h1>
        <p className="text-white-200 md:mt-10 my-5 text-center">
          Reach out to me today and let&apos;s discuss how I can help you
          achieve your goals.
        </p>
        <form onSubmit={handleSubmit} className="mt-8 w-full max-w-2xl space-y-4 text-left" noValidate={false}>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm text-white-200">
              Name
              <input required name="name" autoComplete="name" value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
                className="mt-2 w-full rounded-lg border border-white/[.15] bg-black-200 px-4 py-3 text-white outline-none transition focus:border-purple" />
            </label>
            <label className="text-sm text-white-200">
              Email
              <input required type="email" name="email" autoComplete="email" value={form.email}
                onChange={(event) => setForm({ ...form, email: event.target.value })}
                className="mt-2 w-full rounded-lg border border-white/[.15] bg-black-200 px-4 py-3 text-white outline-none transition focus:border-purple" />
            </label>
          </div>
          <label className="block text-sm text-white-200">
            Subject
            <input required name="subject" value={form.subject}
              onChange={(event) => setForm({ ...form, subject: event.target.value })}
              className="mt-2 w-full rounded-lg border border-white/[.15] bg-black-200 px-4 py-3 text-white outline-none transition focus:border-purple" />
          </label>
          <label className="block text-sm text-white-200">
            Message
            <textarea required name="message" value={form.message}
              onChange={(event) => setForm({ ...form, message: event.target.value })}
              className="mt-2 min-h-32 w-full resize-y rounded-lg border border-white/[.15] bg-black-200 px-4 py-3 text-white outline-none transition focus:border-purple" />
          </label>
          <button type="submit" disabled={status === "sending"}
            className="relative inline-flex h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-lg bg-slate-950 px-7 text-sm font-medium text-white ring-1 ring-purple/70 transition hover:ring-purple disabled:cursor-not-allowed disabled:opacity-60 md:w-60">
            {status === "sending" ? "Sending..." : "Let's get in touch"}
            {status !== "sending" && <FaLocationArrow />}
          </button>
          <p role="status" aria-live="polite" className="min-h-6 text-sm text-white-200">
            {status === "success" && "Thanks, your message has been sent."}
            {status === "error" && "Something went wrong. Please try again."}
          </p>
        </form>
      </div>
      <div className="flex mt-16 md:flex-row flex-col justify-between items-center">
        <p className="md:text-base text-sm md:font-normal font-light">
          Copyright © 2026 Mc Joseph
        </p>

        <div className="flex items-center md:gap-3 gap-6">
          {socialMedia.map((info) => (
            <a
              key={info.id}
              href={info.link}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 cursor-pointer flex justify-center items-center backdrop-filter backdrop-blur-lg saturate-180 bg-opacity-75 bg-black-200 rounded-lg border border-black-300"
            >
              <Image src={info.img} alt="icons" width={20} height={20} />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
