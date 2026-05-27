import { useUpgradeModal } from "@/hooks/use-upgrade-modal";

export function DownloadButton() {
  const { onOpen } = useUpgradeModal();

  const handleDownload = () => {
    if (!isPremium) {
      onOpen({
        title: "Tải nhạc ngoại tuyến",
        description:
          "Bạn cần gói Premium để lưu bài hát này về máy và nghe khi không có mạng.",
      });
      return;
    }
    // Xử lý tải nhạc...
  };
}
