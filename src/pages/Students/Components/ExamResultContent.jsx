function ScoreRing({ marks, total }) {
  const percentage = total > 0 ? Math.round((marks / total) * 100) : 0;
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;
  const isPassed = percentage >= 60;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="96" height="96" className="-rotate-90">
        <circle
          cx="48"
          cy="48"
          r={radius}
          stroke="#ede9fe"
          strokeWidth="7"
          fill="none"
        />
        <circle
          cx="48"
          cy="48"
          r={radius}
          stroke={isPassed ? "#7c3aed" : "#a78bfa"}
          strokeWidth="7"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-xl font-black text-violet-700 leading-none">
          {marks}
        </span>
        <span className="text-xs text-violet-400 font-medium">/{total}</span>
      </div>
    </div>
  );
}

function QuestionCard({ question, studentAnswer, index }) {
  const isCorrect = studentAnswer === question.answer;
  const options = [
    question.option_1,
    question.option_2,
    question.option_3,
    question.option_4,
  ];

  return (
    <div className="rounded-xl border border-violet-100 bg-white overflow-hidden shadow-sm">
      <div className="flex items-start gap-3 px-4 py-3 bg-violet-50 border-b border-violet-100">
        <span className="mt-0.5 flex-shrink-0 w-6 h-6 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center text-xs font-bold">
          {index + 1}
        </span>
        <p className="text-sm font-medium text-gray-700 leading-snug">
          {question.question}
        </p>
      </div>
      <div className="px-4 py-3 grid grid-cols-1 gap-2">
        {options.map((opt, i) => {
          const isStudentPick = opt === studentAnswer;
          let optStyle = "border border-gray-200 bg-gray-50 text-gray-500";
          if (isStudentPick)
            optStyle = isCorrect
              ? "border border-green-400 bg-green-50 text-green-700"
              : "border border-red-300 bg-red-50 text-red-600";

          return (
            <div
              key={i}
              className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium ${optStyle}`}
            >
              <span>{opt}</span>
              {isStudentPick && (
                <span
                  className={`text-xs font-semibold ${isCorrect ? "text-green-600" : "text-red-500"}`}
                >
                  {isCorrect ? "✓ Your answer" : "✗ Your answer"}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function ExamResultContent({ examData }) {
  const { userId, examination, studentanswer, result, marks, type, createdAt } =
    examData;
  const total = examination.questions.length;
  const isPassed = result === "PASS";
  const formattedDate = new Date(createdAt).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <div className="w-full bg-white">
      {/* Top accent bar */}
      <div className="h-1 w-full bg-violet-500" />

      {/* Header */}
      <div className="px-6 pt-5 pb-4 flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <span className="text-xs font-semibold uppercase tracking-widest text-violet-400">
            {type} Assessment
          </span>
          <h2 className="text-base font-bold text-gray-800 leading-tight mt-1 truncate">
            {examination.examtitle}
          </h2>
          <p className="text-xs text-gray-400 mt-1">{formattedDate}</p>
        </div>
        <ScoreRing marks={marks} total={total} />
      </div>

      {/* Stats strip */}
      <div className="mx-6 mb-5 grid grid-cols-3 divide-x divide-violet-100 bg-violet-50 rounded-xl border border-violet-100 overflow-hidden">
        {[
          {
            label: "Result",
            value: result,
            color: isPassed ? "text-green-600" : "text-red-500",
          },
          {
            label: "Passing",
            value: `${examination.passingPercentage}%`,
            color: "text-gray-700",
          },
          {
            label: "Score",
            value: `${marks}/${total}`,
            color: "text-gray-700",
          },
        ].map(({ label, value, color }) => (
          <div key={label} className="flex flex-col items-center py-3">
            <span className={`text-sm font-black ${color}`}>{value}</span>
            <span className="text-xs text-gray-400 mt-0.5">{label}</span>
          </div>
        ))}
      </div>

      {/* Student info */}
      <div className="mx-6 mb-5 flex items-center gap-3 px-4 py-3 bg-violet-50 rounded-xl border border-violet-100">
        <div className="w-9 h-9 rounded-full bg-violet-200 flex items-center justify-center flex-shrink-0">
          <span className="text-violet-700 text-sm font-bold uppercase">
            {userId.name.charAt(0)}
          </span>
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-800 truncate">
            {userId.name}
          </p>
          <p className="text-xs text-gray-400 truncate">{userId.email}</p>
        </div>
        <span className="ml-auto flex-shrink-0 text-xs px-2.5 py-1 bg-violet-100 text-violet-600 rounded-full font-semibold">
          {userId.role}
        </span>
      </div>

      {/* Questions */}
      <div className="px-6 pb-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-violet-400 mb-3">
          Question Review
        </p>
        <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
          {examination.questions.map((q, i) => (
            <QuestionCard
              key={q._id}
              question={q}
              studentAnswer={studentanswer[i]}
              index={i}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
