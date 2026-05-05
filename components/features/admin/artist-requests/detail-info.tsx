import { siFacebook, siYoutube, siInstagram } from "simple-icons";

import { BrandIcon } from "@/components/icons";
import { ZoomableImage } from "@/components/shared";

import { cn } from "@/lib/utils/utils";
import { ArtistRequest } from "@/types";

interface DetailInfoProps {
  detailRequest: ArtistRequest | null;
}

export function DetailInfo({ detailRequest }: DetailInfoProps) {
  return (
    <div className="flex flex-col gap-5 text-sm text-muted-foreground mt-4 text-left max-h-[65vh] overflow-y-auto pr-2 pb-2 custom-scrollbar">
      {/* --- HEADER --- */}
      <div className="flex items-center gap-4 pb-5 border-b border-border">
        <ZoomableImage
          src={detailRequest?.profileImage}
          alt={detailRequest?.stageName}
          className="w-16 h-16 rounded-full border-2 border-border shadow-lg"
          fallbackClassName="rounded-full border-2 border-border bg-card"
        />

        <div>
          <span className="text-xs font-medium text-muted-foreground block mb-1 uppercase tracking-wider">
            Nghệ sĩ
          </span>
          <h2 className="text-2xl font-bold text-foreground tracking-tight">
            {detailRequest?.stageName || "Nghệ sĩ vô danh"}
          </h2>
        </div>
      </div>

      {/* --- BIO --- */}
      <div className="space-y-2">
        <span className="font-semibold text-foreground">Tiểu sử (Bio):</span>
        <p className="bg-card p-3.5 rounded-lg border border-border leading-relaxed text-muted-foreground">
          {detailRequest?.bio || "Không có"}
        </p>
      </div>

      {/* --- CONTACT INFO & COPYRIGHT --- */}
      <div className="bg-card p-4 rounded-lg border border-border space-y-4">
        <div>
          <span className="font-semibold text-foreground">Email liên hệ:</span>
          <a
            href={`mailto:${detailRequest?.contactEmail}`}
            className="text-primary ml-2 hover:underline transition-colors"
          >
            {detailRequest?.contactEmail || "Không có"}
          </a>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-semibold text-foreground">Bản quyền:</span>
          {detailRequest?.agreedToTerms ? (
            <span className="text-emerald-500 font-bold bg-emerald-500/10 px-2 py-0.5 rounded text-xs border border-emerald-500/20">
              Đã cam kết
            </span>
          ) : (
            <span className="text-destructive font-bold bg-destructive/10 px-2 py-0.5 rounded text-xs border border-destructive/20">
              Chưa cam kết
            </span>
          )}
        </div>

        <div className="pt-2 border-t border-border">
          <span className="font-semibold text-foreground mb-2 block">
            Bản thu Demo:
          </span>
          {detailRequest?.demoLink ? (
            <audio
              controls
              src={detailRequest.demoLink}
              className="w-full h-10 rounded-md outline-none"
            />
          ) : (
            <span className="text-destructive italic text-sm">
              Chưa cung cấp file âm thanh
            </span>
          )}
        </div>
      </div>

      {/* --- SOCIALS --- */}
      <div className="space-y-2">
        <span className="font-semibold text-foreground block">
          Mạng xã hội:
        </span>
        <div className="flex flex-wrap items-center gap-3 bg-card p-3.5 rounded-lg border border-border">
          {(detailRequest?.socialLinks as any)?.facebook && (
            <a
              href={(detailRequest?.socialLinks as any).facebook}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 hover:opacity-75 transition-opacity bg-background px-3 py-1.5 rounded-md border border-border"
            >
              <BrandIcon icon={siFacebook} className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium text-muted-foreground">
                Facebook
              </span>
            </a>
          )}
          {(detailRequest?.socialLinks as any)?.youtube && (
            <a
              href={(detailRequest?.socialLinks as any).youtube}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 hover:opacity-75 transition-opacity bg-background px-3 py-1.5 rounded-md border border-border"
            >
              <BrandIcon icon={siYoutube} className="w-4 h-4 text-red-500" />
              <span className="text-sm font-medium text-muted-foreground">
                YouTube
              </span>
            </a>
          )}
          {(detailRequest?.socialLinks as any)?.instagram && (
            <a
              href={(detailRequest?.socialLinks as any).instagram}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 hover:opacity-75 transition-opacity bg-background px-3 py-1.5 rounded-md border border-border"
            >
              <BrandIcon icon={siInstagram} className="w-4 h-4 text-pink-500" />
              <span className="text-sm font-medium text-muted-foreground">
                Instagram
              </span>
            </a>
          )}
          {!(detailRequest?.socialLinks as any)?.facebook &&
            !(detailRequest?.socialLinks as any)?.youtube &&
            !(detailRequest?.socialLinks as any)?.instagram && (
              <span className="text-muted-foreground italic text-sm">
                Chưa cung cấp liên kết nào
              </span>
            )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-2 p-4 bg-card rounded-lg border border-border">
        <div>
          <span className="font-semibold text-foreground block text-xs mb-1">
            Ngày gửi:
          </span>
          <span className="text-muted-foreground">
            {detailRequest?.createdAt
              ? new Date(detailRequest.createdAt).toLocaleDateString("vi-VN")
              : "N/A"}
          </span>
        </div>
        <div>
          <span className="font-semibold text-foreground block text-xs mb-1">
            Cập nhật lúc:
          </span>
          <span className="text-muted-foreground">
            {detailRequest?.updatedAt
              ? new Date(detailRequest.updatedAt).toLocaleDateString("vi-VN")
              : "N/A"}
          </span>
        </div>

        {detailRequest?.reviewedAt && (
          <>
            <div className="pt-2">
              <span className="font-semibold text-foreground block text-xs mb-1">
                Ngày xử lý:
              </span>
              <span className="text-muted-foreground">
                {new Date(detailRequest.reviewedAt).toLocaleDateString("vi-VN")}
              </span>
            </div>
            <div className="pt-2">
              <span className="font-semibold text-foreground block text-xs mb-1">
                Người xử lý:
              </span>
              <span className="text-muted-foreground truncate block">
                {detailRequest.reviewedBy}
              </span>
            </div>
          </>
        )}
      </div>

      {/* --- REVIEW COMMENT --- */}
      {detailRequest?.reviewComment && (
        <div className="space-y-2 mt-2">
          <span
            className={cn(
              "font-bold block",
              detailRequest.status === "REJECTED"
                ? "text-destructive"
                : "text-emerald-500",
            )}
          >
            {detailRequest.status === "REJECTED"
              ? "Lý do từ chối:"
              : "Lời nhắn từ Admin:"}
          </span>
          <p
            className={cn(
              "p-3.5 rounded-lg border leading-relaxed",
              detailRequest.status === "REJECTED"
                ? "bg-destructive/10 text-destructive border-destructive/20"
                : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
            )}
          >
            {detailRequest.reviewComment}
          </p>
        </div>
      )}
    </div>
  );
}
