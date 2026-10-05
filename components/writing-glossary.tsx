"use client";

import { CircleHelp } from "lucide-react";
import { useEffect, type ReactNode } from "react";

const TERMS = [
  {
    id: "microvm",
    title: "microVM",
    body: "A very small virtual machine, usually started for one session and thrown away after. Heavier isolation than a container, much smaller than a normal cloud VM. meta.ai and Grok both run interpreter code in one of these.",
  },
  {
    id: "af-vsock",
    title: "AF_VSOCK",
    body: "A Linux socket type for talking between a guest and its hypervisor without a normal IP network. You connect with a context ID (CID) and a port, the same way TCP uses an address and a port.",
  },
  {
    id: "cid-1",
    title: "CID 1",
    body: "In vsock, CID 1 means the local guest (loopback inside that VM). A listener on CID 1, such as port 23, is a service in the same guest that runs your code. It is not the host.",
  },
  {
    id: "cid-2",
    title: "CID 2",
    body: "In vsock, CID 2 means the host or VMM. A connection to CID 2 is the guest reaching something on the hypervisor side. On Meta that was the notify socket.",
  },
  {
    id: "vmm",
    title: "VMM",
    body: "Virtual machine monitor. The program on the host that actually runs the microVM: devices, vsock, and snapshots. Firecracker is a VMM. Meta's stack calls theirs VMVM.",
  },
  {
    id: "golden-image",
    title: "Golden image (RO)",
    body: "The read-only base disk the VM boots from. Here that is /dev/vda. RO means the guest is not supposed to change it. Anything baked into that image (SSH host keys, for example) is the same on every clone until Meta or xAI rebuilds the image.",
  },
  {
    id: "overlay",
    title: "Overlay / RW upper",
    body: "Linux can stack a read-only lower directory and a writable upper directory and show you one filesystem. The live root is that combination. New and changed files land in the upper directory (upperdir), which sits on a writable disk. RW means that disk accepts writes.",
  },
  {
    id: "writevessel",
    title: "Writevessel",
    body: "Meta's name for the writable disk, /dev/vdb. It backs the overlay upper. Root in the guest can mount it and place files that then show up on the live filesystem.",
  },
  {
    id: "fsync-volatile",
    title: "fsync=volatile",
    body: "An overlay mount option about how durable writes are across a snapshot. It does not mean the writes stay in RAM. They still hit the backing disk. A later snapshot may or may not keep them.",
  },
  {
    id: "socat",
    title: "socat",
    body: "A small program that connects two endpoints and copies bytes between them. On Meta it was listening on vsock port 23 and starting bash for every connection, so connecting to that port gave a shell.",
  },
  {
    id: "guest-proxy",
    title: "guest_proxy",
    body: "A Meta process inside the guest. Its Unix socket at /run/guest_proxy/proxy.sock speaks HTTP. A CONNECT to 127.0.0.1:22 through it reached sshd on loopback. Loopback means that same guest, not the public internet.",
  },
  {
    id: "sd-notify",
    title: "sd_notify",
    body: "systemd's tiny status protocol. A process sends lines like READY=1 and STATUS=... to tell the supervisor it is up. Meta's VMM listens for those messages from the guest on vsock CID 2.",
  },
  {
    id: "seccomp",
    title: "seccomp",
    body: "A Linux kernel filter on system calls. Even root can be blocked from certain calls (ptrace, mounting, raw sockets, and so on) if seccomp is on. Seccomp: 2 in /proc means a filter is installed.",
  },
  {
    id: "nonewprivs",
    title: "NoNewPrivs",
    body: "A process flag. Once set, that process and its children cannot gain new privileges through setuid binaries or file capabilities.",
  },
  {
    id: "capabilities",
    title: "Capabilities (CapEff)",
    body: "Linux splits traditional root into separate privileges called capabilities (change network config, mount filesystems, kill any process, and so on). CapEff is the set currently in effect. A value of 000001ffffffffff is essentially the full set.",
  },
  {
    id: "firecracker",
    title: "Firecracker",
    body: "AWS's microVM monitor, written in Rust. Grok's guest could open http://172.16.0.1/ and get a page that says Hello from Firecracker Host, so the VMM on the other side of that network is Firecracker.",
  },
  {
    id: "crackerjack",
    title: "Crackerjack / VMVM",
    body: "Meta's internal names for the meta.ai code-interpreter microVM. Crackerjack is the guest image and agents. VMVM is the hypervisor side. PID 1's environment variable VMVM_KERNEL_MODULES_DEVICE=1 is a fingerprint of that stack.",
  },
  {
    id: "hades",
    title: "Hades, Charon, Styx",
    body: "xAI's names for the Grok interpreter guest. Hades is the stack. Charon is the agent (init and serve-ch-vsock, gRPC). Styx is a privileged helper binary in the same image. catatonit is the tiny PID 1 that starts them.",
  },
  {
    id: "fuse",
    title: "FUSE (grok-files)",
    body: "Filesystem in Userspace. A normal program, not the kernel's disk driver, answers file reads and writes. Grok mounts artifacts this way (grok-files) so session files show up at a path without being a normal block device.",
  },
  {
    id: "gateway",
    title: "Host gateway",
    body: "The IP on the host side of the guest's virtual network. On Grok the guest was 172.16.0.2 and the gateway was 172.16.0.1. Packets to that address leave the guest toward the platform.",
  },
] as const;

function openDefinition(id: string) {
  const el = document.getElementById(`def-${id}`);
  if (el instanceof HTMLDetailsElement) el.open = true;
}

export function Term({ id, children }: { id: string; children: ReactNode }) {
  return (
    <>
      {children}
      <a
        href={`#def-${id}`}
        aria-label="Show definition"
        title="Show definition"
        className="ml-0.5 inline-flex translate-y-[-1px] align-middle text-[var(--text-subtle)] no-underline hover:text-[var(--link)]"
        onClick={() => openDefinition(id)}
      >
        <CircleHelp className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
      </a>
    </>
  );
}

export function Glossary() {
  useEffect(() => {
    const openFromHash = () => {
      const id = window.location.hash.replace(/^#/, "");
      if (!id.startsWith("def-")) return;
      const el = document.getElementById(id);
      if (el instanceof HTMLDetailsElement) el.open = true;
    };
    openFromHash();
    window.addEventListener("hashchange", openFromHash);
    return () => window.removeEventListener("hashchange", openFromHash);
  }, []);

  return (
    <div className="not-prose my-6 space-y-2">
      {TERMS.map((term) => (
        <details
          key={term.id}
          id={`def-${term.id}`}
          className="scroll-mt-24 rounded-[12px] border border-[var(--border)] bg-[var(--bg-secondary)]"
        >
          <summary className="cursor-pointer list-none px-4 py-3 text-[15px] font-medium text-[var(--text)] [&::-webkit-details-marker]:hidden">
            <span className="mr-2 text-[var(--text-subtle)]" aria-hidden>
              +
            </span>
            {term.title}
          </summary>
          <p className="px-4 pb-4 text-[15px] leading-relaxed text-[var(--text-muted)]">{term.body}</p>
        </details>
      ))}
    </div>
  );
}
