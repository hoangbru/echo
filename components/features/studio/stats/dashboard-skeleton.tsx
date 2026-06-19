"use client";

export function ArtistDashboardSkeleton() {
  return (
    <div className="space-y-[32px] max-w-7xl mx-auto p-[32px] animate-pulse">
      <div>
        <div className="h-[36px] w-[200px] bg-muted rounded-[var(--radius)] mb-2"></div>
        <div className="h-[20px] w-[350px] bg-muted rounded-[var(--radius)]"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[24px]">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-card border border-border rounded-[var(--radius)] p-[24px]"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-[var(--radius)] bg-muted"></div>
              <div className="w-[80px] h-[24px] rounded-[4px] bg-muted"></div>
            </div>
            <div>
              <div className="h-[16px] w-[100px] bg-muted rounded-[4px] mb-2"></div>
              <div className="h-[28px] w-[140px] bg-muted rounded-[4px]"></div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[24px]">
        <div className="lg:col-span-2 bg-card border border-border rounded-[var(--radius)] p-[24px] flex flex-col">
          <div className="h-[24px] w-[200px] bg-muted rounded-[4px] mb-[24px]"></div>

          <div className="flex-1 w-full min-h-[300px] bg-muted/50 rounded-[var(--radius)]"></div>
        </div>

        <div className="bg-card border border-border rounded-[var(--radius)] p-[24px]">
          <div className="h-[24px] w-[180px] bg-muted rounded-[4px] mb-[24px]"></div>
          <div className="space-y-[16px]">
            {[...Array(4)].map((_, idx) => (
              <div key={idx} className="flex items-center gap-[16px]">
                <div className="w-12 h-12 rounded-[4px] bg-muted flex-shrink-0"></div>

                <div className="flex-1 space-y-2">
                  <div className="h-[15px] w-[80%] bg-muted rounded-[4px]"></div>
                  <div className="h-[13px] w-[50%] bg-muted rounded-[4px]"></div>
                </div>
              </div>
            ))}
          </div>

          <div className="w-full h-[40px] mt-[24px] rounded-[var(--radius)] bg-muted"></div>
        </div>
      </div>
    </div>
  );
}
