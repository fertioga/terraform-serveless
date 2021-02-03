resource "aws_iam_policy_attachment" "create_bookings_policy_attachment" {
  name       = "${var.environment}-create-bookings-attachment"
  roles      = [aws_iam_role.create_bookings_iam_role.name]
  policy_arn = aws_iam_policy.create_bookings_policy.arn
}