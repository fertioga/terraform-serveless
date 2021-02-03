resource "aws_iam_role" "create_bookings_iam_role" {
  name = "${var.environment}-create-bookings-iam-role"

  assume_role_policy = templatefile("${path.module}/templates/lambda-base-policy.tpl",
    {}
  )
}

resource "aws_ssm_parameter" "create_bookings_iam_role" {
    name = "${var.environment}-create-bookings-iam-role"
    type = "String"
    value = aws_iam_role.create_bookings_iam_role.arn
}