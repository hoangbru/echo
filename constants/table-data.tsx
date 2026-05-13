export const renderTableHeaders = (status: string) => {
  if (status === "PENDING") {
    return (
      <>
        <th className="py-4 px-4 w-1/3">Nghệ sĩ</th>
        <th className="py-4 px-4">Mạng xã hội</th>
        <th className="py-4 px-4">Ngày gửi</th>
      </>
    );
  }
  if (status === "REJECTED") {
    return (
      <>
        <th className="py-4 px-4">Nghệ sĩ</th>
        <th className="py-4 px-4 w-1/3">Người duyệt</th>
        <th className="py-4 px-4">Ngày xử lý</th>
      </>
    );
  }
  if (status === "APPROVED") {
    return (
      <>
        <th className="py-4 px-4">Nghệ sĩ</th>
        <th className="py-4 px-4">Người duyệt</th>
        <th className="py-4 px-4">Ngày xử lý</th>
      </>
    );
  }
  // "all"
  return (
    <>
      <th className="py-4 px-4">Nghệ sĩ</th>
      <th className="py-4 px-4">Trạng thái</th>
      <th className="py-4 px-4">Ngày gửi</th>
    </>
  );
};
