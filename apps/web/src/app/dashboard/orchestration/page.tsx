"use client";

import { useState } from "react";
import {
  Play,
  Pause,
  Clock,
  Zap,
  GitBranch,
  Bell,
  Timer,
  Lock,
  Wheat,
  ArrowLeftRight,
  Send,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ChevronRight,
  Plus,
  TrendingUp,
  TrendingDown,
  Activity,
  Calendar,
  MousePointerClick,
} from "lucide-react";
import { PageShell, StatCard, Section, TableShell } from "@/components/page-shell";
import { AnimatedCounter } from "@/components/animated-counter";
import { MiniChart } from "@/components/mini-chart";
import { cn } from "@/lib/utils";
import {
  getOrchestrationStats,
  listWorkflows,
  listExecutions,
  getStepTypes,
} from "./actions";

const iconMap: Record<string, React.ReactNode> = {
  Wheat: <Wheat className="h-4 w-4" />,
  ArrowLeftRight: <ArrowLeftRight className="h-4 w-4" />,
  Send: <Send className="h-4 w-4" />,
  GitBranch: <GitBranch className="h-4 w-4" />,
  Bell: <Bell className="h-4 w-4" />,
  Timer: <Timer className="h-4 w-4" />,
  Lock: <Lock className="h-4 w-4" />,
};

const triggerIcon = {
  schedule: <Calendar className="h-3.5 w-3.5" />,
  event: <Zap className="h-3.5 w-3.5" />,
  manual: <MousePointerClick className="h-3.5 w-3.5" />,
};

export default async function OrchestrationPage() {
  const [stats, workflows, executions, stepTypes] = await Promise.all([
    getOrchestrationStats(),
    listWorkflows(),
    listExecutions(),
    getStepTypes(),
  ]);

  return (
    <PageShell
      title="Intent Orchestration"
      description="Multi-step workflow automation with scheduling, conditions, and cross-chain execution"
      status="online"
      statusLabel="Orchestrator active"
      headerAction={
        <button className="inline-flex items-center gap-2 rounded-lg bg-sdp-accent px-4 py-2 text-sm font-medium text-white hover:bg-sdp-accent/90 transition-colors">
          <Plus className="h-4 w-4" />
          New Workflow
        </button>
      }
    >
      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Active Workflows"
          value={stats.activeWorkflows}
          icon={<Activity className="h-5 w-5" />}
          accent="indigo"
        />
        <StatCard
          label="Total Executions"
          value={stats.totalExecutions.toLocaleString()}
          icon={<CheckCircle2 className="h-5 w-5" />}
          accent="emerald"
        />
        <StatCard
          label="Success Rate"
          value={`${stats.successRate}%`}
          icon={<TrendingUp className="h-5 w-5" />}
          accent="violet"
        />
        <StatCard
          label="Gas Saved"
          value={`$${stats.gasSaved.toLocaleString()}`}
          icon={<TrendingDown className="h-5 w-5" />}
          accent="amber"
        />
      </div>

      {/* Step Types Palette */}
      <Section title="Workflow Steps" action={<span className="text-xs text-white/30">Drag to build</span>}>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {stepTypes.map((step) => (
            <div
              key={step.id}
              className="group flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.03] p-4 backdrop-blur-sm cursor-grab hover:border-white/[0.12] hover:bg-white/[0.05] transition-all"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sdp-accent/10 text-sdp-accent">
                {iconMap[step.icon] || <Activity className="h-4 w-4" />}
              </div>
              <div>
                <p className="text-sm font-medium text-white">{step.label}</p>
                <p className="text-xs text-white/30">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Workflows + Executions */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Workflows */}
        <Section title="Active Workflows" action={<span className="text-xs text-white/30">{workflows.length} total</span>}>
          <div className="space-y-3">
            {workflows.map((wf) => (
              <WorkflowCard key={wf.id} workflow={wf} />
            ))}
          </div>
        </Section>

        {/* Recent Executions */}
        <Section title="Recent Executions">
          <div className="space-y-3">
            {executions.map((ex) => (
              <ExecutionCard key={ex.id} execution={ex} />
            ))}
          </div>
        </Section>
      </div>
    </PageShell>
  );
}

function WorkflowCard({ workflow }: { workflow: Awaited<ReturnType<typeof listWorkflows>>[number] }) {
  const isActive = workflow.status === "active";

  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-4 backdrop-blur-sm hover:border-white/[0.12] transition-all">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-medium text-white truncate">{workflow.name}</h3>
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium",
                isActive ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"
              )}
            >
              {isActive ? <Play className="h-2.5 w-2.5" /> : <Pause className="h-2.5 w-2.5" />}
              {workflow.status}
            </span>
          </div>
          <div className="flex items-center gap-3 mt-2">
            <span className="inline-flex items-center gap-1 text-xs text-white/40">
              {triggerIcon[workflow.trigger]}
              {workflow.triggerConfig}
            </span>
            <span className="text-xs text-white/30">{workflow.steps} steps</span>
          </div>
          <div className="flex items-center gap-4 mt-2">
            <span className="text-xs text-white/30">
              Last: {new Date(workflow.lastRun).toLocaleDateString()}
            </span>
            <span className="text-xs text-white/30">
              Next: {workflow.nextRun}
            </span>
          </div>
        </div>
        <div className="text-right ml-4 shrink-0">
          <div className="text-xs text-white/40">{workflow.successRate}% success</div>
          <div className="text-xs text-emerald-400 mt-0.5">${workflow.gasSaved.toLocaleString()} saved</div>
        </div>
      </div>
    </div>
  );
}

function ExecutionCard({ execution }: { execution: Awaited<ReturnType<typeof listExecutions>>[number] }) {
  const [expanded, setExpanded] = useState(false);
  const isSuccess = execution.status === "success";

  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-sm overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between p-4 hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-3">
          {isSuccess ? (
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          ) : (
            <XCircle className="h-4 w-4 text-rose-400" />
          )}
          <div className="text-left">
            <p className="text-sm font-medium text-white">{execution.workflowName}</p>
            <p className="text-xs text-white/30">
              {new Date(execution.startedAt).toLocaleTimeString()} · {execution.gasUsed.toLocaleString()} CU
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {execution.gasSaved > 0 && (
            <span className="text-xs text-emerald-400">${execution.gasSaved.toLocaleString()} saved</span>
          )}
          <ChevronRight
            className={cn("h-4 w-4 text-white/30 transition-transform", expanded && "rotate-90")}
          />
        </div>
      </button>

      {expanded && (
        <div className="border-t border-white/[0.06] px-4 pb-4">
          <div className="mt-3 space-y-2">
            {execution.steps.map((step, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/[0.03] text-xs text-white/30">
                  {i + 1}
                </div>
                {step.status === "success" ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                ) : (
                  <XCircle className="h-3.5 w-3.5 text-rose-400" />
                )}
                <span className="text-sm text-white/70">{step.name}</span>
                {step.txHash && (
                  <code className="text-xs text-sky-400 font-mono">{step.txHash}</code>
                )}
                {step.status === "failed" && step.error && (
                  <span className="text-xs text-rose-400 flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    {step.error}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
